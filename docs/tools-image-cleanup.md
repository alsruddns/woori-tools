# Tools Docker image cleanup

Production deploys pin the newly built GHCR image by digest, then also assign the immutable `sha-<commit>` tag and the `latest` convenience tag. The deploy job records the running Tools container's previous image ID before replacement. Health or route verification failures use that ID for rollback.

Only after the deployed image ID and digest, container health, loopback routes and sitemap, and public sitemap/canonical/hreflang checks pass, the workflow streams `scripts/cleanup-tools-images.sh` to the production host. The cleanup keeps the current image and the immediately previous normal image for rollback. It considers unique image IDs from the exact `ghcr.io/alsruddns/woori-tools` repository and preserves an ID if any running or stopped container refers to it, or if any other repository also refers to it. Removal failures are logged as cleanup failures; they do not invoke the deployment rollback.

The `develop` to `main` PR preflight runs the same script with `DRY_RUN=1` against the current production image. This reports candidate IDs without removing anything. Unit scenarios use a mock Docker CLI to cover first deployment, multiple old images, duplicate tags, container references, other repositories, digest mismatch, dry run, and removal failure.

The workflow never runs a global image or system prune and does not remove containers, volumes, or data. A manual read-only candidate check can be run on the host with:

```bash
current_image_id="$(docker inspect --format '{{.Image}}' tools)"
DRY_RUN=1 bash scripts/cleanup-tools-images.sh "$current_image_id" "" ""
```
