const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

/**
 * Google Cloud Text-to-Speech Service
 * Converts text to voiceover audio using Google's neural voices
 */

class GoogleTTSService {
  constructor() {
    this.projectId = process.env.GOOGLE_TTS_PROJECT_ID;
    this.keyFile = process.env.GOOGLE_TTS_KEY_FILE || './credentials/google-tts-service-account.json';
    this.languageCode = process.env.GOOGLE_TTS_LANGUAGE_CODE || 'en-US';
    this.encoding = process.env.GOOGLE_TTS_ENCODING || 'MP3';
    this.audioRate = process.env.GOOGLE_TTS_AUDIO_RATE || 24000;
    this.defaultVoice = process.env.GOOGLE_TTS_DEFAULT_VOICE || 'en-US-Neural2-C';

    // Check if credentials file exists
    if (!fs.existsSync(this.keyFile)) {
      throw new Error(`Google TTS credentials not found at: ${this.keyFile}`);
    }

    // Initialize client with service account
    this.client = new textToSpeech.TextToSpeechClient({
      keyFilename: this.keyFile
    });

    // Voice options: Neural2 (premium), Standard (basic)
    this.voices = {
      'default': 'en-US-Neural2-C',    // Alloy-like (female)
      'male': 'en-US-Neural2-A',       // Male voice
      'female': 'en-US-Neural2-E',     // Female voice
      'robotic': 'en-US-Standard-A'    // Standard (less natural)
    };
  }

  /**
   * Convert text to speech
   * @param {string} text - Text to convert
   * @param {string} voiceType - Voice type (default, male, female, robotic)
   * @returns {Promise<object>} - Audio file info
   */
  async textToSpeech(text, voiceType = 'default') {
    try {
      console.log(`[GoogleTTS] Converting text to speech (voice: ${voiceType})`);
      console.log(`[GoogleTTS] Text length: ${text.length} characters`);

      // Validate input
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
      }

      if (text.length > 5000) {
        console.warn(`[GoogleTTS] Text exceeds 5000 characters, truncating...`);
        text = text.substring(0, 5000);
      }

      // Select voice
      const voiceKey = voiceType.toLowerCase();
      const voiceName = this.voices[voiceKey] || this.defaultVoice;

      console.log(`[GoogleTTS] Using voice: ${voiceName}`);

      // Prepare request
      const request = {
        input: { text: text },
        voice: {
          languageCode: this.languageCode,
          name: voiceName
        },
        audioConfig: {
          audioEncoding: this.encoding,
          sampleRateHertz: this.audioRate,
          speakingRate: 1.0,  // Normal speed (0.25 - 4.0)
          pitch: 0.0          // Normal pitch (-20 to 20)
        }
      };

      // Call Google TTS API
      console.log('[GoogleTTS] Calling Google Cloud Text-to-Speech API...');
      const [response] = await this.client.synthesizeSpeech(request);

      if (!response.audioContent) {
        throw new Error('No audio content in response');
      }

      console.log('[GoogleTTS] Audio generated successfully');

      return {
        success: true,
        audio: response.audioContent,
        encoding: this.encoding,
        voice: voiceName,
        duration: Math.ceil(text.length / 100) * 3  // Rough estimate in seconds
      };

    } catch (error) {
      console.error('[GoogleTTS] TTS conversion error:', error.message);
      throw new Error(`Text-to-speech conversion failed: ${error.message}`);
    }
  }

  /**
   * Save audio to file
   * @param {Buffer} audioContent - Audio buffer
   * @param {string} outputPath - Output file path
   * @returns {Promise<string>} - Saved file path
   */
  async saveAudio(audioContent, outputPath) {
    try {
      // Ensure output directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write audio to file
      fs.writeFileSync(outputPath, audioContent, 'binary');
      console.log(`[GoogleTTS] Audio saved to: ${outputPath}`);

      return outputPath;

    } catch (error) {
      console.error('[GoogleTTS] Save audio error:', error.message);
      throw new Error(`Failed to save audio: ${error.message}`);
    }
  }

  /**
   * Get available voices
   * @returns {object} - Map of available voices
   */
  getAvailableVoices() {
    return this.voices;
  }

  /**
   * Batch convert multiple texts to speech
   * @param {array} texts - Array of text objects {text, voiceType}
   * @returns {Promise<array>} - Array of audio results
   */
  async batchTextToSpeech(texts) {
    try {
      console.log(`[GoogleTTS] Batch converting ${texts.length} texts...`);

      const results = [];

      for (const item of texts) {
        const result = await this.textToSpeech(item.text, item.voiceType);
        results.push(result);
      }

      return results;

    } catch (error) {
      console.error('[GoogleTTS] Batch conversion error:', error.message);
      throw error;
    }
  }
}

module.exports = GoogleTTSService;
