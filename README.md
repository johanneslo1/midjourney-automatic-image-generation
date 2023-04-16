# Automatic image generation with Midjourney and GPT-3.5-Turbo

[![GitHub stars](https://img.shields.io/github/stars/johanneslo1/midjourney-automatic-image-generation)](https://github.com/johanneslo1/midjourney-automatic-image-generation/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/johanneslo1/midjourney-automatic-image-generation)](https://github.com/johanneslo1/midjourney-automatic-image-generation/network)
[![GitHub issues](https://img.shields.io/github/issues/johanneslo1/midjourney-automatic-image-generation)](https://github.com/johanneslo1/midjourney-automatic-image-generation/issues)
[![GitHub license](https://img.shields.io/github/license/johanneslo1/midjourney-automatic-image-generation)](https://github.com/johanneslo1/midjourney-automatic-image-generation/blob/main/LICENSE)

This is a Node.js application for automatically generating images using Midjourney. This repository is for educational purposes only.

Disclaimer: This project is the result of a short tinkering. The code is not really well structured, but worked for my use case. When I find the time, I will do a refactoring. In the meantime, maybe the code will help you as a starting point for other projects.

## Getting Started

Follow the steps below to set up the application.

### Prerequisites

- Node.js
- npm

### Before Installation

1. Invite the Midjourney bot to your own Discord server.
2. Create a new text channel on your server.
3. Copy the text channel ID for later use in the `.env` file.
4. Set Midjourney generation to public using the `/public` command.
5. Adjust your desired Midjourney version and quality settings using the `/settings` command.

### Installation

1. Clone the repository:

```
git clone https://github.com/johanneslo1/midjourney-automatic-image-generation.git
```

2. Navigate to the project directory:

```
cd midjourney-automatic-image-generation
```

3. Install the dependencies:

```
npm install
```

4. Copy the `.env.example` file and rename it to `.env`:

```
cp .env.example .env
```

5. Open the `.env` file and set the required environment variables:

- `CHANNEL_ID`: The Discord channel ID where the images will be posted (from step 3 of "Before Installation").
- `GUILD_ID`: The Discord server ID.
- `OPENAI_API_KEY`: [Your OpenAI API key.](https://platform.openai.com/account/api-keys)
- `OPENAI_ORGANIZATION`: [Your OpenAI organization ID.](https://platform.openai.com/account/org-settings)
- `DISCORD_AUTHORIZATION_TOKEN`: Your Discord authorization token. [Here is a guide on how to get yours.](https://www.androidauthority.com/get-discord-token-3149920/)

### Usage

Run the application:

```
npm run start
```

The application will generate images using Midjourney and post them to the specified Discord channel.

## Important Note

Using this application with your personal Discord account to automate tasks is against Discord's Terms of Service. This repository is for educational purposes only, and you should not use it in a way that violates Discord's policies.



## Acknowledgements

 - [Wildric-Auric/MidJourney-Wrapper](https://github.com/Wildric-Auric/MidJourney-Wrapper)
