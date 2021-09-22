# Install docker <https://docs.docker.com/get-docker/>

## Run application

    docker build . -t tdnode
    docker run -i --name telegramjs tdnode

After successfull login send message to yourself!

## Stop application

    docker kill telegramjs
    docker container prune -f
