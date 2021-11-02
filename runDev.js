var child_process = require('child_process');

let show = function (commond, restart = false) {
    return new Promise(async (resolve, reject) => {

        console.log("evaling:", commond)
        let ls = child_process.exec(commond, { encoding: 'utf8' })
        ls.stdout.on('data', function (data) {
            console.log('-------stdout----------------');
            console.log(data);
        });

        ls.stderr.on('data', function (data) {
            console.log('-------stderr----------------');
            console.log(data);
        });

        ls.on('close', function (code) {

            console.log('child process exited with code ' + code);
            if (code === 2) {
                console.log("program crashed!");
                process.stdout.write('\x07')
                process.exit()
            }
            
            resolve(true)
            // if (restart) {
            //     start()
            // }
        });
    });
};
let start = (async () => {
    console.log('========restarting==============================');
    await show("tsc")
    // await show("XCOPY .\\src .\\build /d /e /l  /EXCLUDE:xcopy.txt")
    await show("XCOPY .\\src .\\build /d /e /EXCLUDE:xcopy.txt")
    await show("yarn dev")
    start()
});
start()