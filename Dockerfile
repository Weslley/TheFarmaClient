FROM python:3.6
ENV PYTHONUNBUFFERED 1

RUN apt-get update
RUN apt-get install -y certbot python-certbot-nginx
RUN apt-get install -y libpq-dev openssl git gcc libffi-dev libssl-dev libxml2-dev libxslt1-dev zlib1g-dev libgraphviz-dev graphviz graphviz-dev pkg-config locales

WORKDIR /thefarmaclient

COPY . /thefarmaclient/

EXPOSE 8000

RUN sed -i -e 's/# pt_BR.UTF-8 UTF-8/pt_BR.UTF-8 UTF-8/' /etc/locale.gen && locale-gen

ENV LANG pt_BR.UTF-8
ENV LANGUAGE pt_BR:pt
ENV LC_ALL pt_BR.UTF-8

RUN pip install -r requirements.txt
