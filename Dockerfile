FROM ubuntu:24.04

ENV HUGO_VERSION=0.128.0

# RUN wget -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
#     && sudo dpkg -i hugo.deb \
#     && rm hugo.deb

# RUN dpkg -i https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb

RUN apt-get update \
    && apt-get install -y hugo \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m hugo

USER hugo

WORKDIR /hugo

ENTRYPOINT ["/usr/bin/hugo"]
CMD ["--help"]
