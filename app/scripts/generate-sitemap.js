#!/usr/bin/env node

/**
 * Sitemap Generation Script
 * 
 * This script generates the sitemap by fetching data from APIs
 * and can be run periodically or during builds.
 * 
 * Usage:
 * - npm run generate-sitemap
 * - node scripts/generate-sitemap.js
 */

import { generateXMLSitemap, generateSitemapData } from '../app/utils/sitemap.mjs';
import fs from 'fs';
import path from 'path';

const SITEMAP_OUTPUT_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');
const SITEMAP_DATA_PATH = path.join(process.cwd(), 'public', 'sitemap-data.json');

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');
  
  try {
    // Generate XML sitemap
    console.log('📄 Generating XML sitemap...');
    const xmlSitemap = await generateXMLSitemap();
    
    // Ensure public directory exists
    const publicDir = path.dirname(SITEMAP_OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write XML sitemap to file
    fs.writeFileSync(SITEMAP_OUTPUT_PATH, xmlSitemap);
    console.log(`✅ XML sitemap generated: ${SITEMAP_OUTPUT_PATH}`);
    
    // Generate structured data for visual sitemap
    console.log('📊 Generating sitemap data...');
    const sitemapData = await generateSitemapData();
    
    // Write structured data to file (for potential use by other tools)
    fs.writeFileSync(SITEMAP_DATA_PATH, JSON.stringify(sitemapData, null, 2));
    console.log(`✅ Sitemap data generated: ${SITEMAP_DATA_PATH}`);
    
    // Log statistics
    console.log('\n📈 Sitemap Statistics:');
    console.log(`   • Total Products: ${sitemapData.stats.totalProducts}`);
    console.log(`   • Total Categories: ${sitemapData.stats.totalCategories}`);
    console.log(`   • Total Tags: ${sitemapData.stats.totalTags}`);
    console.log(`   • Unique Products: ${sitemapData.stats.uniqueProductNames}`);
    console.log(`   • Generated at: ${new Date().toISOString()}`);
    
    console.log('\n🎉 Sitemap generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export default generateSitemap; 