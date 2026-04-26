import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { config } from '../config/env.js';

/**
 * Load and parse a CSV file from the data directory.
 * Returns array of objects keyed by header row.
 */
export function loadCSV(filename) {
  const filePath = path.join(config.dataDir, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Data file not found: ${filename}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    cast: true,           // auto-cast numbers/booleans
    cast_date: false,
  });
}

/**
 * Append a row object to a CSV file.
 * Creates the file with headers if it does not exist.
 */
export function appendCSV(filename, row) {
  const filePath = path.join(config.dataDir, filename);
  const headers = Object.keys(row);

  if (!fs.existsSync(filePath)) {
    const headerLine = headers.join(',') + '\n';
    fs.writeFileSync(filePath, headerLine, 'utf8');
  }

  const line = headers.map(h => {
    const val = row[h] ?? '';
    // Wrap in quotes if the value contains a comma or newline
    return String(val).includes(',') ? `"${val}"` : String(val);
  }).join(',') + '\n';

  fs.appendFileSync(filePath, line, 'utf8');
}

/**
 * Overwrite an entire CSV file with an array of row objects.
 */
export function writeCSV(filename, rows) {
  if (!rows || rows.length === 0) return;
  const filePath = path.join(config.dataDir, filename);
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    const line = headers.map(h => {
      const val = row[h] ?? '';
      return String(val).includes(',') ? `"${val}"` : String(val);
    }).join(',');
    lines.push(line);
  }
  fs.writeFileSync(filePath, lines.join('\n') + '\n', 'utf8');
}
