# Employee Tracker

[![License Badge](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

This is a Node.js command-line application that utilizes MySQL to allow a user to view and update their company's departments, roles, and employees.

![Image displaying application's functionality](./public/assets/images/Screenshot.png)

## Demo

[Video Demonstration](https://drive.google.com/file/d/1lYEg6qc6xSdFe0hj2HdufWXGXINoSnSs/view?usp=sharing)

## Usage

To use this application, you must first install Node.js and MySQL. Then, install necessary dependencies with the following command:

```
npm i
```

Then create a .env file that includes your MySQL username and password with the following command:

```
cp .env.EXAMPLE .env
```

Then create and seed the employees database with following commands:

```
mysql -uroot -p
source db/schema.sql
source db/seeds.sql
exit
```

Now you may start the application with the following command:

```
node index.js
```

### Questions

If you have any questions about this repository, open an issue or contact me directly at [pcragnol@gmail.com](mailto:pcragnol@gmail.com). You can find more of my work at [pcragnol](https://github.com/pcragnol/).

---
© 2022 Peter Cragnoline

Licensed under [MIT License](LICENSE)
