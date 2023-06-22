FROM alpine:edge as alpine

RUN apk add -U --no-cache ca-certificates

FROM golang:1.20.5 AS build 

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 go build -ldflags '-extldflags "-static"' -o main .

FROM scratch
LABEL maintainer="Christian Windi Utomo <hi@kris.my.id>"

COPY --from=build /app/main /main
COPY --from=alpine /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

CMD ["/main"]