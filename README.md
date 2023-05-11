# File_Transfer_System

# Rapid Hive
Innovative file transfer system to streamline your workflow.

![Project home page](/LandingPage.png "Landing page")

## Installation details and User manual
- To install the software, clone the repository on your system with
    ```
    git clone https://github.com/Ritam727/File_Transfer_System.git
    ```

- Navigate into the project folder 
    ```
    cd File_Transfer_System
    ```

- Then run `npm install` and `pip install -r requirements.txt` to install the required packages

- Install requirements
     ```
    npm install

    pip install -r requirements.txt
    ``` 

- Start the server
    ```
    npm run start
    ```

- Go to 
    ```
  https://localhost:5000/
  ```

## Other than the method above, you can also use Docker to directly run the application without having to install any dependencies
- Make sure you have docker installed on your system.

- Inside the project directory, run the following commands:
```
$ docker build -t rapidhive .
$ docker run --name rapidhive -p 8000:5000 rapidhive
```

- You can visit the website at `localhost:8000`
