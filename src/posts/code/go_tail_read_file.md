---
date: 2024-04-15
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - go
  - io
  - 
---

# Go语言实现按照行数逆序读取文件 - 模拟tail命令

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202404152051856.png)
<!-- more -->
---

## 编写

Linux中的tail命令很多人应该都用过，我们经常用它来看日志

```bash
$ tail -n 100 /etc/nginx/access.log
```

如果在用go语言实现这一个功能，也是非常的简单，要点就是利用`Seek`这一函数

```go
// Seek sets the offset for the next Read or Write on file to offset, interpreted
// according to whence: 0 means relative to the origin of the file, 1 means
// relative to the current offset, and 2 means relative to the end.
// It returns the new offset and an error, if any.
Seek(offset int64, whence int) (ret int64, err error)
```

它的第一个参数是偏移量，第二个参数总共有三个值

- `0`，相对于文件头
- `1`，相对于当前的偏移量
- `2`，相对于文件末尾

一个需要注意的点就是换行符问题，在linux上换行符是CR`\n`，而在windows上则是CRLF`\r\n`，在计算偏移量的时候这个问题不能忽视掉，在逆序读取的时候就一个字节一个字节的读，当遇到`\n`时就停止，然后再根据不同系统来更新偏移量。最后还需要注意的是逆序读取的偏移量不能小于文件大小的负数，否则就越过文件的起始位置了，在思路明确了以后，编码就比较轻松了，代码整体如下所示。

```go
func Tail(filename string, n int) ([][]byte, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

    // 得到文件的大小
	stat, err := file.Stat()
	if err != nil {
		return nil, err
	}
	size := stat.Size()

	// 起始偏移量-1
	var offset int64 = -1
	lines := make([][]byte, 0, n)
	char := make([]byte, 1)

	for n > 0 {
		// 行缓存
		buf := make([]byte, 0, 16)

		// 一个字节一个字节的逆序读取
		for offset >= -size {
			_, err := file.Seek(offset, io.SeekEnd)
			if err != nil {
				return nil, err
			}

			_, err = file.Read(char)
			if err != nil {
				return nil, err
			}
			if char[0] == '\n' {
				break
			}
			buf = append(buf, char[0])
			offset--
		}
		
        // 由于是逆序读取，需要将行反转
		slices.Reverse(buf)
		lines = append(lines, buf)
		n--

        
		offset--
        // 如果是windows系统，则需要额外移动偏移量
		if runtime.GOOS == "windows" { // CRLF
			offset--
		}

		// 防止seek指针移动到起始位置之外
		if offset < -size {
			break
		}
	}

    // 最后再整体反转
	slices.Reverse(lines)
	return lines, err
}
```



## 测试

文件`test.txt`

```
hello nihao
buhao
wohao
dajiahao
aaa
bbb
ccccccdddda
z\nzcda
```

一个简单的测试代码

```go
func main() {
	tails, err := Tail("test.txt", 2)
	if err != nil {
		log.Fatal(err)
	}
	for _, tail := range tails {
		fmt.Println(string(tail))
	}
}
```

输出

```
ccccccdddda
z\nzcda
```

