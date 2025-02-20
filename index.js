const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const axios = require('axios');

// Replace the following with your actual bot configuration details
const CONFIG = {
    token: 'YOUR_BOT_TOKEN',  // Your bot token here
    guildId: 'YOUR_GUILD_ID',  // Your guild ID here
    channels: {
        voice: 'YOUR_VOICE_CHANNEL_ID',  // Voice channel ID here
    },
    radio: {
        streamUrl: 'https://icecast.skyrock.net/s/natio_aac_128k',
        volume: 0.5,
        metadataUrl: 'https://skyrock.fm/api/v3/player/onair/super?client=multiplayer_test_page'
    }
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message]
});

class RadioManager {
    constructor() {
        this.player = createAudioPlayer();
        this.connection = null;
    }

    async connectToVoice() {
        const voiceChannel = client.channels.cache.get(CONFIG.channels.voice);
        if (!voiceChannel) return;

        this.connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });

        this.connection.on(VoiceConnectionStatus.Ready, () => this.startStream());
        this.connection.on(VoiceConnectionStatus.Disconnected, () => {
            setTimeout(() => this.connectToVoice(), 5000);
        });
    }

    startStream() {
        const resource = createAudioResource(CONFIG.radio.streamUrl, { inlineVolume: true });
        resource.volume.setVolume(CONFIG.radio.volume);
        this.player.play(resource);
        this.connection.subscribe(this.player);
    }
}

const radio = new RadioManager();

async function updateStatus() {
    try {
        const response = await axios.get(CONFIG.radio.metadataUrl);
        const schedule = response.data.radios.natio.schedule[0];

        if (schedule && schedule.artists.length > 0 && schedule.info) {
            const artist = schedule.artists.map(a => a.name).join(', ');
            const title = schedule.info.title;
            const status = `${artist} - ${title}`;
            
            setTimeout(() => {
                client.user.setActivity(status, { type: ActivityType.Listening });
            }, 20000); // 20 seconds delay
        } else {
            client.user.setActivity("Skyrock", { type: ActivityType.Listening });
        }
    } catch (error) {
        console.error("Error while retrieving metadata", error);
    }
}

client.once('ready', () => {
    console.log(`Bot connected: ${client.user.tag}`);
    radio.connectToVoice();
    updateStatus();
    setInterval(updateStatus, 10000);
});

client.login(CONFIG.token);
