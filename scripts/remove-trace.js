// attempt to truncate and remove .next/trace
import fs from 'fs'
import path from 'path'

const tracePath = path.resolve(process.cwd(), '.next', 'trace')

async function run(){
  console.log('tracePath:', tracePath)
  try{
    if(!fs.existsSync(tracePath)){
      console.log('.next/trace does not exist')
      return
    }
    // Try truncating file first
    const fd = fs.openSync(tracePath, 'r+')
    fs.ftruncateSync(fd,0)
    fs.closeSync(fd)
    console.log('truncated .next/trace')
    // Then unlink
    fs.unlinkSync(tracePath)
    console.log('deleted .next/trace')
  }catch(err){
    console.error('remove error', err)
    process.exitCode = 1
  }
}

run()
