```shell
# upstream 指定后端服务器地址
upstream 127.0.0.1:10080 {    
  server 127.0.0.1:10080 weight=2 max_conns=100; #weight 权重2，最大连接数100
  server 127.0.0.1:10081 weight=1 down; #down 当前服务器不参与负载均衡
  server 127.0.0.1:10082 weight=1 backup; #backup 备用节点，只会在其他节点不可用时使用
  server 127.0.0.1:10083 weight=1 max_fails=10,fail_timeout=10s; #请求失败重复次数10，经过max_fails次失败后服务器暂停时间10s
}

# $binary_remote_addr 远程IP地址 zone 区域名称 10m内存区域大小
limit_conn_zone $binary_remote_addr zone=coon_zone:10m;

server {
  limit_conn conn_zone 1; # 设置共享内存区域conn_zone的连接数为1

  listen   80;
  server_name   localhost; # 用户访问 localhost，反向代理到 127.0.0.1:10080
  location / {
    proxy_pass 127.0.0.1:10080
  }
  
  #开启文件压缩
  location ~ .*\. (html|js|css)$ {
    gzip on; #启用压缩
    gzip_min_length 1k; # 超过1K的文件才压缩
    gzip_http_version 1.1; # 启用gzip压缩所需的HTTP最低版本
    gzip_comp_level 9; # 压缩级别，压缩比率越高，文件被压缩的体积越小
    gzip_types text/css application/javascript; # 进行压缩的文件类型
    root /data/www/html;
  }
  
  #ip访问限制
  location ~ ^/index.html {
    # 对于index.html 页面
    deny 192.168.0.1; #拒绝
    allow all; #允许除deny之外所有
  }
  
  # 防盗链 文件类型 
  location ~ .*\.(jpg|png|gif)$ {
    valid_referers none blocked 127.0.0.1; #valid_referers 白名单
    if ($invalid_referer) {
      return 403; #$invalid_referer 返回403
    }
  }
  
  
}
```
