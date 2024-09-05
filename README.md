[![SemApps](https://badgen.net/badge/Powered%20by/SemApps/28CDFB)](https://semapps.org)

# Mastopod

A Mastodon-compatible app that saves all data on your Pod.

Built on the [ActivityPods](https://activitypods.org) framework.

## Commands

### For development

`make start` Starts the activitypods provider using a docker-compose file. This includes the activitypods backend and frontend server, the fuseki db, mailcatcher, redis, and arena.

`make stop` Stops and removes all containers for the activitypods provider.

`make config` Prints the config with the `.env`-file-provided environment variables filled.

`make logs-activitypods` Prints the activitypods provider logs.

`make attach-activitypods` Attaches to the [moleculer](https://moleculer.services/) repl of the activitypods backend.

### For production

`make build-prod` Builds the activitypods provider images for production. In addition to the dev images, this includes a traefik reverse proxy.

`make start-prod` Starts the activitypods provider containers for production.

`make stop-prod` Stops and removes running activitypods provider containers.

`make config-prod` Prints the config with the `.env`-file-provided environment variables filled.

`make attach-backend-prod` Attaches to the [moleculer](https://moleculer.services/) repl of the activitypods backend.

## Funding

This project is funded through the [NGI0 Entrust Fund](https://nlnet.nl/entrust), a fund
established by [NLnet](https://nlnet.nl) with financial support from the European Commission's
[Next Generation Internet](https://ngi.eu) program, under the aegis of DG Communications Networks,
Content and Technology under grant agreement No 101069594. Learn more on the [NLnet project page](https://nlnet.nl/project/ActivityPods).

[<img src="https://nlnet.nl/logo/banner.png" alt="NLNet foundation logo" width="300" />](https://nlnet.nl/)
[<img src="https://nlnet.nl/image/logos/NGI0Entrust_tag.svg" alt="NGI Zero Entrust Logo" width="300" />](https://nlnet.nl/entrust)
