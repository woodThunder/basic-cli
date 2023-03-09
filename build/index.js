import fsExtra from 'fs-extra';
const buildInit = () => {
  fsExtra.copy('package.json', 'dist/package.json', err => {
    console.log("build success")
  });
};

buildInit();