FROM mhart/alpine-node AS Builder

# 创建app目录
RUN mkdir -p /usr/src/honeycomb-pc

# 设置工作目录
WORKDIR /usr/src/honeycomb-pc

COPY package.json yarn.lock /usr/src/honeycomb-pc/

RUN yarn

COPY . /usr/src/honeycomb-pc

RUN yarn run build

# 设置基础镜像
FROM nginx
# 将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY --from=Builder /usr/src/honeycomb-pc/dist  /usr/share/nginx/html

# 覆盖nginx配置
COPY --from=Builder /usr/src/honeycomb-pc/nginx.conf	/etc/nginx/conf.d/default.conf
