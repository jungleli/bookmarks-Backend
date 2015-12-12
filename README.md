bookmarks-Backend 
===================

前后台可分离，nodejs作为restful提供数据接口。

----------

环境准备
-------------

 1. 数据库
	- 下载并安装 [MongoDB](https://www.mongodb.org/downloads)
	
 2. nodejs

  	- 下载并安装[nodejs](https://nodejs.org/en/)

运行项目
-------------
 1. clone

  git clone https://github.com/jungleli/bookmarks-Backend
  
 2. 安装npm依赖包

	```
	>cd <project-folder>
	>npm install
	```
 3. 启动database server

	```
	>cd <mongdb-install-folder/bin>
	>mongodexe --dbpath "<project-folder>/data/"
	```
 4. 运行项目
 
	```
	>cd <project-folder>
	>npm start
	```
 5. 打开浏览，启动：

    >http://localhost:3000


 
**if you don't want restart serve after the code changed, do as below**

	```
	>npm install -g nodemon
	```

Then change the package.json file,
"scripts": {
    "start": "node ./bin/www"
  },

to

"scripts": {
    **"start": "nodemon ./bin/www"**
  },