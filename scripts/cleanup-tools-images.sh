#!/usr/bin/env bash
set -uo pipefail

readonly TOOLS_REPOSITORY='ghcr.io/alsruddns/woori-tools'
readonly CURRENT_IMAGE_ID="${1:-}"
readonly PREVIOUS_IMAGE_ID="${2:-}"
readonly EXPECTED_DIGEST="${3:-}"
readonly DRY_RUN="${DRY_RUN:-0}"

log() { printf '%s\n' "$*"; }
fail() { log "ERROR: $*" >&2; exit 1; }
valid_image_id() { [[ "$1" =~ ^sha256:[a-f0-9]{64}$ ]]; }

valid_image_id "$CURRENT_IMAGE_ID" || fail 'A full current Tools image ID is required.'
if [[ -n "$PREVIOUS_IMAGE_ID" ]] && ! valid_image_id "$PREVIOUS_IMAGE_ID"; then
  fail 'Previous Tools image ID must be a full sha256 image ID.'
fi
if [[ -n "$EXPECTED_DIGEST" && ! "$EXPECTED_DIGEST" =~ ^sha256:[a-f0-9]{64}$ ]]; then
  fail 'Expected deployed digest must be a sha256 digest.'
fi

running_tools_image_id="$(docker inspect tools --format '{{.Image}}')" || fail 'Could not inspect the Tools container.'
[[ "$running_tools_image_id" == "$CURRENT_IMAGE_ID" ]] || fail "Tools container image changed before cleanup: expected $CURRENT_IMAGE_ID, found $running_tools_image_id."

disk_snapshot() {
  local label="$1" summary root available
  summary="$(docker system df 2>&1)" || summary="unavailable: $summary"
  log "$label Docker disk usage:"
  log "$summary"
  root="$(docker info --format '{{.DockerRootDir}}' 2>/dev/null)" || root=''
  if [[ -n "$root" ]] && command -v df >/dev/null 2>&1; then
    available="$(df -B1 --output=avail "$root" 2>/dev/null | tail -n 1 | tr -d '[:space:]')"
    if [[ "$available" =~ ^[0-9]+$ ]]; then printf '%s' "$available"; return; fi
  fi
  printf ''
}

before_available="$(disk_snapshot 'Before cleanup')"
listing="$(docker image ls --all --no-trunc --format '{{.ID}}\t{{.Repository}}\t{{.Tag}}\t{{.Digest}}')" || fail 'Could not list Docker images; refusing cleanup.'
declare -A tools_image_ids=()
declare -A foreign_repository_ids=()
while IFS=$'\t' read -r id repository tag digest; do
  [[ -n "$id" && "$id" != '<none>' ]] || continue
  if [[ "$repository" == "$TOOLS_REPOSITORY" ]]; then
    tools_image_ids["$id"]=1
  elif [[ -n "$repository" && "$repository" != '<none>' ]]; then
    foreign_repository_ids["$id"]="$repository"
  fi
done <<< "$listing"

[[ -n "${tools_image_ids[$CURRENT_IMAGE_ID]:-}" ]] || fail "Current image $CURRENT_IMAGE_ID has no exact $TOOLS_REPOSITORY repository reference."
if [[ -n "$EXPECTED_DIGEST" ]]; then
  current_digests="$(docker image inspect "$CURRENT_IMAGE_ID" --format '{{json .RepoDigests}}')" || fail 'Could not inspect the deployed image digests.'
  [[ "$current_digests" == *"${TOOLS_REPOSITORY}@${EXPECTED_DIGEST}"* ]] || fail "Running Tools image does not carry expected digest ${EXPECTED_DIGEST}; refusing cleanup."
  log "Verified running Tools digest: ${EXPECTED_DIGEST}"
fi
if [[ -n "$PREVIOUS_IMAGE_ID" && "$PREVIOUS_IMAGE_ID" != "$CURRENT_IMAGE_ID" && -z "${tools_image_ids[$PREVIOUS_IMAGE_ID]:-}" ]]; then
  fail "Previous rollback image $PREVIOUS_IMAGE_ID has no exact $TOOLS_REPOSITORY repository reference; refusing cleanup."
fi

containers="$(docker ps --all --quiet --no-trunc)" || fail 'Could not list containers; refusing cleanup.'
declare -A referenced_image_ids=()
while IFS= read -r container_id; do
  [[ -n "$container_id" ]] || continue
  image_id="$(docker inspect "$container_id" --format '{{.Image}}')" || fail "Could not inspect container $container_id; refusing cleanup."
  referenced_image_ids["$image_id"]="$container_id"
done <<< "$containers"

declare -a candidates=()
for id in "${!tools_image_ids[@]}"; do
  [[ "$id" != "$CURRENT_IMAGE_ID" && "$id" != "$PREVIOUS_IMAGE_ID" ]] && candidates+=("$id")
done
log "Current Tools image preserved: $CURRENT_IMAGE_ID"
log "Previous rollback image preserved: ${PREVIOUS_IMAGE_ID:-none (first deployment)}"
if ((${#candidates[@]})); then log "Deletion candidates (unique image IDs): ${candidates[*]}"; else log 'Deletion candidates (unique image IDs): none'; fi

removed=0
failures=0
excluded_containers=0
excluded_repositories=0
for id in "${candidates[@]}"; do
  if [[ -n "${referenced_image_ids[$id]:-}" ]]; then
    log "Excluded $id: referenced by container ${referenced_image_ids[$id]} (running or stopped)."
    ((excluded_containers+=1))
    continue
  fi
  if [[ -n "${foreign_repository_ids[$id]:-}" ]]; then
    log "Excluded $id: also referenced by non-Tools repository ${foreign_repository_ids[$id]}."
    ((excluded_repositories+=1))
    continue
  fi
  if [[ "$DRY_RUN" == '1' ]]; then
    log "DRY RUN: would remove Tools-only image $id."
    continue
  fi
  if output="$(docker image rm "$id" 2>&1)"; then
    log "Removed Tools-only image $id${output:+: $output}"
    ((removed+=1))
  else
    log "Failed to remove Tools image $id: $output"
    ((failures+=1))
  fi
done

after_available="$(disk_snapshot 'After cleanup')"
if [[ "$before_available" =~ ^[0-9]+$ && "$after_available" =~ ^[0-9]+$ ]]; then
  log "Docker root available space change: $((after_available - before_available)) bytes."
else
  log 'Docker root available-space delta unavailable.'
fi
log "Image cleanup result: $([[ "$DRY_RUN" == '1' ]] && printf dry-run || printf complete); removed=$removed; failures=$failures; excludedContainerReferences=$excluded_containers; excludedOtherRepositories=$excluded_repositories."
((failures == 0)) || fail "$failures Tools image removal(s) failed; deployment remains healthy and cleanup requires review."
