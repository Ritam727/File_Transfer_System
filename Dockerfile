FROM nikolaik/python-nodejs:python3.8-nodejs18

WORKDIR /code
RUN chown -R root "/code"
COPY requirements.txt requirements.txt
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i
RUN pip install -r requirements.txt
EXPOSE 5000

COPY . .
CMD ["npm", "run", "start"]
