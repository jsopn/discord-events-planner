# Discord Events Planner
This application is designed to create recurring events for Discord servers that take place every day.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## Getting Started
### Installation

1. Clone the repository:

```bash
git clone https://github.com/jsopn/discord-events-planner.git
```

2. Change into the project directory:

```bash
cd discord-events-planner
```

3. Build the Docker image:

```bash
docker build -t discord-events-planner .
```

### Running the Application

To run the Discord Events Planner application, use the following command:

```bash
docker run -p 3000:3000 discord-events-planner
```

This will start the application and make it available at `http://localhost:3000`.

## Contributing

Contributions are welcome! If you encounter any bugs, have suggestions, or want to enhance the application, please open an issue or submit a pull request to this repository.

- For bug reports or feature requests, please use the [issue tracker](https://github.com/jsopn/discord-events-planner/issues).
- For contributions, please follow the [pull request guidelines](https://github.com/jsopn/discord-events-planner/pulls).

## License

This project is licensed under the [MIT License](LICENSE). 
Feel free to use, modify, or distribute this code as per the terms of this license.