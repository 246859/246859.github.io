---
date: 2023-06-29
article: true
star: false
sticky: false
category:
  - docker
tag:
  - docker
  - nginx
  -

---

# Docker安装nginx

![](https://w.wallhaven.cc/full/zy/wallhaven-zyxvqy.jpg)

docker安装nginx
<!-- more -->
---
Docker安装nginx时一般都是直接使用命令

```sh
docker run -p 80:80 --name=nginx \
--restart=always --privileged=true \
-v /home/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /home/nginx/conf/conf.d:/etc/nginx/conf.d \
-v /home/nginx/log:/var/log/nginx \
-v /home/nginx/html:/usr/share/nginx/html \
-d nginx:latest
```

但后来还是觉得直接把静态文件打包进镜像可能会更加方便些

```dockerfile
FROM nginx
WORKDIR /root/
USER root

COPY html /usr/share/nginx/html
COPY nginx /etc/nginx/

EXPOSE 80

VOLUME ["/etc/nginx/","/usr/share/nginx/html"]
```

运行命令

```
docker build -f ./DockerFile -t dstm/ui:latest .
```

目录下的html是打包好的静态文件，nginx是nginx配置文件夹。
