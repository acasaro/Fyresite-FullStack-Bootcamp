/**
 * @author Luis Angel Garcia
 * 
 * This is a utility script that copies activities' src files from Week 20
 * over into this directory's React app.
 */

const fs = require('fs');
const ncp = require('ncp').ncp;
const inquirer = require('inquirer');

require('dotenv').config();

const projectRoot = __dirname;
const activityFolder = process.env.ACTIVTY_DIR || "../../01-Activities";

console.log(`Activity folder path: ${projectRoot}/${activityFolder}`)

readDirectory(
  `${projectRoot}/${activityFolder}`,
  (err, dirs) => askDirectory(dirs),
);

/**
 * Retrieves all of the subdirectories in dir.
 * Sends the error `err` and `result` into the callback function `cb`
 * 
 * @param {string} dir The directory to walk through.
 * @param {(err: any, result: string[]) => void} cb The callback function that handles the result.
 */
function readDirectory(dir, cb) {
  fs.readdir(dir, cb);
}

/**
 * Creates an inquirer prompt that uses the `subdirs` array as choices.
 * @param {string[]} subdirs 
 */
async function askDirectory(subdirs) {
  const { dir } = await inquirer.prompt({
    type: 'list',
    name: 'dir',
    message: 'Choose an activity to run: ',
    choices: subdirs,
  });

  // Walk through the chosen directory and check for whether it is a student folder.
  // The way we will check is to see if the substring `Solved` appears in any of the subdirectory names.
  readDirectory(`${projectRoot}/${activityFolder}/${dir}`, (err, subdirs) => {

    // If it is a student directory, ask whether they want the Solved or Unsovled folder.
    if (subdirs.some(s => /Solved/.test(s)) ) { 
      askIfSolved(`${projectRoot}/${activityFolder}/${dir}`);
      return;
    }

    // Otherwise, copy the directory from the source to the root of this project.
    moveDirectoryOver(`${projectRoot}/${activityFolder}/${dir}`);
  })
}

/**
 * Creates an inquirer prompt that asks whether the user wants to
 * use a Solved or Unsolved student folder.
 * @param {string} dir 
 */
async function askIfSolved(dir) {
  console.log('This directory is a Student folder, which means it contains a Solved folder and an Unsolved folder.');
  const { projectFolder } = await inquirer.prompt({
    type: 'list',
    name: 'projectFolder',
    message: 'Would you like to use the Solved or Unsolved Folder?',
    choices: ['Solved', 'Unsolved'],
  });

  moveDirectoryOver(`${dir}/${projectFolder}`);
}

/**
 * Moves the *src* folder found in `dir` to the root of this project. 
 * @param {string} dir The source directory. 
 */
function moveDirectoryOver(dir) {
  const srcFolderPath = `${dir}/src`;
  const destFolderPath = `${projectRoot}/src`;
  
  // Remove the src folder at the root of this project if it exists.
  if (fs.existsSync(destFolderPath)) {
    console.log(`rm -r ${destFolderPath}`);
    fs.rmdirSync(destFolderPath, { recursive: true });
  }

  console.log(`cp ${srcFolderPath} ${destFolderPath}`);

  // Recursively copy the contents of the src folder
  ncp(srcFolderPath, destFolderPath, function (err) {
    if (err) {
      return console.error(err);
    }
    
    console.log('Done!');
  });
}
