#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * Generates all required PWA icons from a source image
 *
 * Usage: node scripts/generate-icons.js
 *
 * Requirements: npm install sharp
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes required for PWA
const ICON_SIZES = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// Maskable icons (with safe zone padding)
const MASKABLE_SIZES = [
  { size: 192, name: 'icon-maskable-192x192.png' },
  { size: 512, name: 'icon-maskable-512x512.png' },
];

// Apple splash screen sizes
const SPLASH_SIZES = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732.png' },
  { width: 1668, height: 2224, name: 'apple-splash-1668-2224.png' },
  { width: 1536, height: 2048, name: 'apple-splash-1536-2048.png' },
  { width: 1125, height: 2436, name: 'apple-splash-1125-2436.png' },
  { width: 1242, height: 2688, name: 'apple-splash-1242-2688.png' },
  { width: 750, height: 1334, name: 'apple-splash-750-1334.png' },
  { width: 640, height: 1136, name: 'apple-splash-640-1136.png' },
];

// Paths
const SOURCE_IMAGE = path.join(__dirname, '../public/logo.png');
const ICONS_DIR = path.join(__dirname, '../public/icons');
const SPLASH_DIR = path.join(__dirname, '../public/splash');

// Colors
const BACKGROUND_COLOR = '#b91c1c'; // Heritage red
const SPLASH_BACKGROUND = '#fffefb'; // Heritage cream

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

async function generateIcon(sourcePath, outputPath, size) {
  try {
    await sharp(sourcePath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    console.log(`✅ Generated: ${path.basename(outputPath)} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Failed to generate ${outputPath}:`, error.message);
  }
}

async function generateMaskableIcon(sourcePath, outputPath, size) {
  try {
    // Maskable icons need 10% safe zone padding
    const iconSize = Math.floor(size * 0.8);
    const padding = Math.floor((size - iconSize) / 2);

    const icon = await sharp(sourcePath)
      .resize(iconSize, iconSize, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BACKGROUND_COLOR
      }
    })
      .composite([{
        input: icon,
        top: padding,
        left: padding
      }])
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated maskable: ${path.basename(outputPath)} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Failed to generate maskable ${outputPath}:`, error.message);
  }
}

async function generateSplashScreen(sourcePath, outputPath, width, height) {
  try {
    // Icon size is 20% of the smaller dimension
    const iconSize = Math.floor(Math.min(width, height) * 0.2);

    const icon = await sharp(sourcePath)
      .resize(iconSize, iconSize, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toBuffer();

    await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: SPLASH_BACKGROUND
      }
    })
      .composite([{
        input: icon,
        top: Math.floor((height - iconSize) / 2),
        left: Math.floor((width - iconSize) / 2)
      }])
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated splash: ${path.basename(outputPath)} (${width}x${height})`);
  } catch (error) {
    console.error(`❌ Failed to generate splash ${outputPath}:`, error.message);
  }
}

async function main() {
  console.log('\n🎨 PWA Icon Generator\n');
  console.log('━'.repeat(50));

  // Check if source image exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error(`❌ Source image not found: ${SOURCE_IMAGE}`);
    console.log('\n📝 Please create a logo.png file in the public directory.');
    console.log('   Recommended size: 1024x1024 pixels\n');
    process.exit(1);
  }

  // Ensure output directories exist
  await ensureDir(ICONS_DIR);
  await ensureDir(SPLASH_DIR);

  console.log(`\n📷 Source: ${SOURCE_IMAGE}\n`);

  // Generate regular icons
  console.log('🔷 Generating standard icons...\n');
  for (const { size, name } of ICON_SIZES) {
    const outputPath = path.join(ICONS_DIR, name);
    await generateIcon(SOURCE_IMAGE, outputPath, size);
  }

  // Generate maskable icons
  console.log('\n🔶 Generating maskable icons...\n');
  for (const { size, name } of MASKABLE_SIZES) {
    const outputPath = path.join(ICONS_DIR, name);
    await generateMaskableIcon(SOURCE_IMAGE, outputPath, size);
  }

  // Generate splash screens
  console.log('\n🌊 Generating splash screens...\n');
  for (const { width, height, name } of SPLASH_SIZES) {
    const outputPath = path.join(SPLASH_DIR, name);
    await generateSplashScreen(SOURCE_IMAGE, outputPath, width, height);
  }

  console.log('\n' + '━'.repeat(50));
  console.log('✨ Icon generation complete!\n');
}

main().catch(console.error);
