docker-compose down && docker-compose up -d --build && docker-compose logs -f web

#docker-compose down && docker-compose up -d --build && docker-compose run web ./manage.py collectstatic --no-input && docker run -d -v $PWD:/thefarmaclient farmacia_app
#docker-compose down && docker-compose up -d --build && docker-compose run web ./manage.py collectstatic --no-input && docker run -d -v $PWD:/thefarmaclient farmacia_app
#docker-compose down && docker-compose up -d --build && docker-compose run web ./manage.py collectstatic --no-input && docker-compose run -d -v $PWD:/thefarmaclient farmacia_app
