import fs, { copyFileSync, existsSync, mkdirSync, rmSync, removeSync, statSync } from 'fs-extra'
import { green, red } from 'kolorist'
import path from 'node:path'

export function non_exist_dir_name(name: string): boolean {
  // 目标目录路径
  const targetDir = path.resolve(process.cwd(), name)

  if (!fs.existsSync(targetDir)) {
    return true
  }

  const files = fs.readdirSync(targetDir)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

export function copy(src: string, dest: string) {
    const _stat = statSync(src)
    if (_stat.isDirectory()) {
        copy_dir(src, dest)
    } else {
        copyFileSync(src, dest)
    }
}

export function copy_dir(srcDir: string, destDir: string) {
    mkdirSync(destDir, { recursive: true })
    for (const file of fs.readdirSync(srcDir)) {
        const _srcFile = path.resolve(srcDir, file)
        const _destFile = path.resolve(destDir, file)
        copy(_srcFile, _destFile)
    }
}

export function rm_dir(dir: string) {
    if (!existsSync(dir)) {
        return
    }
    console.log(red(`正在删除文件夹${dir}`))
    removeSync(dir);
    console.log(green(`删除文件夹${dir}成功`))
}

export function rm_file(filePath: string) {
    if (!existsSync(filePath)) {
        return
    }
    console.log(red(`正在删除文件${filePath}`))
    rmSync(filePath);
    console.log(green(`删除文件${filePath}成功`))
}

export function edit_file(file: string, callback: (content: string) => string) {
    const _content = fs.readFileSync(file, 'utf-8')
    fs.writeFileSync(file, callback(_content), 'utf-8')
}

export const cwd = process.cwd()

export function get_root(targetDir: string) {
    return path.join(cwd, targetDir)
}

export function is_valid_packagename(projectName: string) {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
      projectName,
    )
}
  