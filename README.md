# mk-portfolio
under construction

## Docker container startup

```bash
cd /path/to/repo

docker build -t <name>:<version> .

docker run -p <local-port>:80/tcp -p <local-port>:80/udp -d <name>:<version>
```

Then go to `https://localhost:<local-port>`
