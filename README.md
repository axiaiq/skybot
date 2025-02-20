# skybot
 
# Skyrock Radio Bot

This bot plays the Skyrock radio stream in a Discord voice channel, and dynamically updates the bot's status with the current playing artist and song title based on Skyrock's metadata.

## Features
- Plays the Skyrock radio stream in a voice channel.
- Updates the bot's status to show the current artist and song title.
- Automatically reconnects if the voice connection is lost.

## Prerequisites
- A [Discord bot](https://discord.com/developers/applications) token.
- Node.js and npm installed on your machine.
- An active Discord server and a voice channel where the bot will connect.

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/axiaiq/skybot
    ```

2. Install the required dependencies:
    ```bash
    npm install discord.js @discordjs/voice axios
    ```

3. Replace the placeholders in the `CONFIG` object in `index.js`:
    - `your-bot-token`: Your bot token from the [Discord Developer Portal](https://discord.com/developers/applications).
    - `your-guild-id`: The ID of your Discord server (guild).
    - `your-voice-channel-id`: The ID of the voice channel where the bot will connect.

4. Run the bot:
    ```bash
    node index.js
    ```

5. The bot should now connect to the specified voice channel and start playing the Skyrock radio stream. It will also update its status with the current song and artist.

## Customization
- **Volume**: You can adjust the stream's volume by changing `CONFIG.radio.volume` (values range from `0` to `1`).
- **Guild and Voice Channel**: Modify `guildId` and `channels.voice` in the `CONFIG` object to point to your desired Discord server and voice channel.

This project is licensed under the MIT License.