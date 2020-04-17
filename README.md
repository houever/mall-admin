# fast-web
基于vue,element,iview的管理后台模板

> centos7 安装nginx
> yum 安装

1. 安装 Nginx
yum 安装nginx非常简单，就输入一条命令即可。

````shell
$ sudo yum -y install nginx   # 安装 nginx
$ sudo yum remove nginx  # 卸载 nginx
````




通过yum安装的时候提示下面的错误

````shell
[root@localhost yum.repos.d]# yum install nginx
已加载插件：fastestmirror, langpacks
Loading mirror speeds from cached hostfile
没有可用软件包 nginx。
错误：无须任何处理
需要添加nginx的源
````



````shell
rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
````

该命令执行之后，会在/etc/yum.respos.d下面多出一个nginx.repo

再执行

````shell
yum install -y nginx
````



使用yum进行Nginx安装时，Nginx配置文件在/etc/nginx目录下。

````shell
cd /etc/nginx
````



2. 配置 Nginx 服务

````shell
$ sudo systemctl enable nginx # 设置开机启动 
$ sudo service nginx start # 启动nginx服务
$ sudo service nginx stop # 停止nginx服务
$ sudo service nginx restart # 重启nginx服务
$ sudo service nginx reload # 重新加载配置，一般是在修改过nginx配置文件时使用。
源码包安装
````

````conf
server {
    # 需要被监听的端口号，前提是此端口号没有被占用，否则在重启 Nginx 时会报错
    listen       8888;
    # 服务名称，无所谓
    server_name  localhost;

    # 上述端口指向的根目录
    root /opt/asing1elife/teamnote;
    # 项目根目录中指向项目首页
    index index.html;

    client_max_body_size 20m; 
    client_body_buffer_size 128k;

    # 根请求会指向的页面
    location / {
      # 此处的 @router 实际上是引用下面的转发，否则在 Vue 路由刷新时可能会抛出 404
      try_files $uri $uri/ @router;
      # 请求指向的首页
      index index.html;
    }

    # 由于路由的资源不一定是真实的路径，无法找到具体文件
    # 所以需要将请求重写到 index.html 中，然后交给真正的 Vue 路由处理请求资源
    location @router {
      rewrite ^.*$ /index.html last;
    }

    # 关键步骤，这里表示将所有的 http://192.168.7.8:8888/teamnote/api/ 开头的请求都转发到下面 proxy_pass 指定的链接中
    # 这里使用 /teamnote/api/ 而不是 /teamnote/ ，是因为前端项目本身的访问链接就是 http:192.168.7.8:8888/teamnote/
    # 为了防止在访问页面时请求就被 Nginx 代理转发，这里需要更具体的配置，才能和前端访问请求区分开
    location /teamnote/api/ {
          # 后端的真实接口
          proxy_pass http://192.168.7.8:2592/teamnote/api/;
          proxy_redirect off;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header   Cookie $http_cookie;
          # for Ajax
          #fastcgi_param HTTP_X_REQUESTED_WITH $http_x_requested_with;
          proxy_set_header HTTP-X-REQUESTED-WITH $http_x_requested_with;
          proxy_set_header HTTP_X_REQUESTED_WITH $http_x_requested_with;
          proxy_set_header x-requested-with $http_x_requested_with;
          client_max_body_size 10m;
          client_body_buffer_size 128k;
          proxy_connect_timeout 90;
          proxy_send_timeout 90;
          proxy_read_timeout 90;
          proxy_buffer_size 128k;
          proxy_buffers 32 32k;
          proxy_busy_buffers_size 128k;
          proxy_temp_file_write_size 128k;
    }
}
````

nginx 配置跨域

````
server {
	listen       8012;
        server_name  127.0.0.1;
		
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods GET,POST,PUT,DELETE,OPTIONS always;
        add_header Access-Control-Allow-Credentials true always;
        add_header Access-Control-Allow-Headers DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,x-auth-token always;
	add_header Access-Control-Max-Age 1728000 always;
		
        if ($request_method = OPTIONS) {
            return 304;
        }
		
	location / {
		proxy_pass http://10.10.10.10:9001;
        }
}
````

