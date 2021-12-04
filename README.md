# ushort
Extremely simple url shortener
- [GitHub](https://github.com/AlexRoar/ushort)
  [Проект](http://alexdremov.me)
- ## Description
	- Зарегистрировал домен на cheapname
	- Прописал домену в cheapname name servers digitalocean
		- n1.digitalocean.com ...
	- Добавил на digitalocean A запись в DNS моего домена для droplet
	- Быстро написал urlshortener на express с sqlite3
	- Подготовить `Dockerfile` и `.dockerignore`
		-
		  ```
		  FROM node:14
		  WORKDIR /usr/src/app
		  COPY . .
		  RUN npm install
		  RUN npx tsc
		  ENV PORT=80
		  EXPOSE 80
		  CMD ["npm", "start"]
		  ```
		- Используется node:14
		- Устанавливается рабочая директория
		- Копирую все данные в дирректорию
		- Установка зависимостей
		- Компиляция TypeScript
		- Установка env для приложения
		- Запуск приложения
	- Подготавливаю файл docker-compose
		-
		  ```
		  version: "3.3"
		  services:
		    web:
		      build: .
		      ports:
		        - "80:80"
		      volumes:
		        - myapp:/usr/src/db
		      expose:
		        - "80"
		  volumes:
		    myapp:
		      external: true
		  ```
	- Из интересного — `volumes` используятся для сохранения файла базы данных sqlite
	- Подготавливаю droplet для docker по гайду digitalocean — просто установка зависимостей
		- https://www.digitalocean.com/community/tutorials/docker-ubuntu-18-04-1-ru
	- Сервер можно запустить через `docker-compose -f docker-compose.yml up -d`
	- Записал эту команду в cron для `@reboot` — запускаться будет сразу после перезапуска droplet
	- Настроил action на GitHub — при push в main обновляются фалы с гита, перезапускается контейнер
		-
		  ``` yaml
		  name: DigitalOcean deploy
		  			  
		  # Controls when the workflow will run
		  on:
		    push:
		      branches: [ main ]
		  			  
		    # Allows you to run this workflow manually from the Actions tab
		    workflow_dispatch:
		  			  
		  jobs:
		    build:
		      runs-on: ubuntu-latest
		      steps:
		        - name: ssh-pipeline
		          # You may pin to the exact commit or the version.
		          # uses: cross-the-world/ssh-pipeline@7f022867934a210af826af99ef80d96f03a094d5
		          uses: cross-the-world/ssh-pipeline@v1.2.0
		          with:
		            # ssh remote host
		            host: ${{secrets.SSH_HOST}}
		            # ssh remote port
		            port: 22
		            # ssh remote user
		            user: ${{secrets.SSH_USER}}
		            # content of ssh private key. ex raw content of ~/.ssh/id_rsa
		            key: ${{secrets.SSH_PRIVATE_KEY}}
		            script: |
		              cd /root
		              rm -rf web
		              git clone https://github.com/alexRoar/ushort web
		              cd web
		              docker-compose -f docker-compose.yml down
		              docker-compose -f docker-compose.yml up -d
		  ```
-
