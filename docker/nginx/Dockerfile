FROM gliderlabs/alpine:3.3
# RUN apk add --no-cache nginx
RUN apk add --update nginx

RUN mkdir -p /app/tmp
WORKDIR /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY express /etc/nginx/sites-enabled/express

CMD ["nginx", "-g", "daemon off;"]
