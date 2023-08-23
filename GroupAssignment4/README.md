# PROG8185-23S-Sec1-Web Technologies Assignment4

## Group Members

- Eugenio Contreras

- Asad Ashraf

- Akshat Arora

- Siyu Liu



## The Usage of Some Middleware

**globalSettings**

The settings.js is an independent file to store the configuration of this application.

![](doc/screenshot/2023-08-01-01-52-55-image.png)

req._settings can get the object storing configuration. (For example, the secret key of jwt)

![](doc/screenshot/2023-08-01-01-54-12-截图_20230801015410.png)



**ConnectDB**

To access the attributes easily, use <u>req._db</u> can get the dbo directly. It is usually used with <u>.getCollection()</u> method, to get the collection object. (use async and await)

![](doc/screenshot/2023-08-01-01-56-32-image.png)

![](doc/screenshot/2023-08-01-01-56-59-image.png)



**jwtValidation**

This is a method bind on req obj, to simplize to process to validate jsonWebToken. The JsonWebToken's payload is an object including email and password like the snap belows:

![](doc/screenshot/2023-08-01-02-01-42-image.png)

When using jwtValidation middleware, call the <u>._authorize() method on req</u>, (await should be used!), then it will return: 

1. decoded object contains email and password

![](doc/screenshot/2023-08-01-02-04-41-image.png)

2. false, it means the token in the request header is invalid.

![](doc/screenshot/2023-08-01-02-06-04-image.png)


