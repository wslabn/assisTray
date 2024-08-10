const { app, Menu, Tray, shell, BrowserWindow, nativeImage } = require('electron')
const path = require('node:path');
const { exec } = require('child_process');
const icon = nativeImage.createFromPath('wrench.ico');
const schedule = require('node-schedule');
const appFolder = path.dirname(process.execPath)
const updateExe = path.resolve(appFolder, '..', 'Update.exe')
const exeName = path.basename(process.execPath)
const { updateElectronApp } = require('update-electron-app');
updateElectronApp(); // additional configuration options available

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 1;
rule.hour = 1;
rule.minute = 0;
rule.tz = 'America/New_York';

const createWindow = () => {
    const settingsWindow = new BrowserWindow({
    icon: icon,
    frame: false,
    skipTaskbar: true,
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
    });

    settingsWindow.loadFile(path.join(__dirname, 'settings.html'));
}

let tray
app.whenReady().then(() => {
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
        label: 'New Support Request',
        click: () => {
            console.log("Support Request");
            shell.openExternal('https://pcrt.appligeeks.com/portal')           
        }
    },
    {
      label: 'New Item',
      click: () => {
          console.log("Support Request");
          shell.openExternal('https://pcrt.appligeeks.com/portal')           
      }
  },
    { type: 'separator' },
    {
        label: 'Settings',
        click: () => {
            console.log("settings");
            createWindow();
        }
    },
    {
        label: 'Quit',
        click: () => {
            console.log("app quiting");            
            app.quit()
        }
    }
  ])

  tray.setToolTip('AppliGeeks Assist')
  tray.setContextMenu(contextMenu)

    console.log(rule);
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)

})

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
function restartNow(){
    let cmd = "restart-computer";
    exec(cmd, { shell: "powershell.exe"}, (error, stdout, stderr) => {
        console.log(stdout);
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
    });
}

let job = schedule.scheduleJob(rule, function(fireDate){
    console.log(`Restart Job ran @ ${fireDate}`);
    restartNow();
});

app.setLoginItemSettings({
    openAtLogin: true,
    path: updateExe,
    args: [
      '--processStart', `"${exeName}"`,
      '--process-start-args', '"--hidden"'
    ]
  })
