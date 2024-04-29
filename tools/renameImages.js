const fs = require("fs");
const path = require("path");
const buffIds = require("../public/data/buff/buffids.json");

const getItemId = (itemName) => {
  return buffIds[itemName];
};

function renameImagesInDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error accessing file:", err);
          return;
        }

        if (stats.isFile() && isImageFile(file)) {
          const itemId = getItemId(path.parse(file).name);
          const newName = path.join(directoryPath, `${itemId}.png`);
          fs.rename(filePath, newName, (err) => {
            if (err) {
              console.error(`Error renaming file ${file}:`, err);
            } else {
              console.log(`Renamed ${file} to ${newName}`);
            }
          });
        }
      });
    });
  });
}

function isImageFile(file) {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp"];
  const ext = path.extname(file).toLowerCase();
  return imageExtensions.includes(ext);
}

const directoryPath = "public/images/previews";
renameImagesInDirectory(directoryPath);
