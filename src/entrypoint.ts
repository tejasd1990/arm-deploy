import { setFailed } from '@actions/core';
import { main } from './main';
import fs from 'fs';

main()
    .then(() => {
        process.exit(0)
    })
    .catch((err: Error) => {
        fs.appendFileSync("loggingggg", "err enter", 'utf8')
        fs.appendFileSync("loggingggg", JSON.stringify(err, (key, value) => {
            if(value instanceof Map) {
              return {
                dataType: 'Map',
                value: Array.from(value.entries()), // or with spread: value: [...value]
              };
            } else {
              return key + value;
            }
          }), 'utf8')
          fs.appendFileSync("loggingggg", "err mid", 'utf8')
        fs.appendFileSync("loggingggg", err, 'utf8')
        fs.appendFileSync("loggingggg", "err leave", 'utf8')
        setFailed(err.message);
        process.exit(1);
    });