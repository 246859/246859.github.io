---
date: 2022-10-23
article: true
category: 算法
tag:
  - sort
  - data struct
  - go
---

# 经典排序算法

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312081421944.png)

<!-- more -->
---

## 冒泡排序

冒泡排序是最简单的一种排序，也是最暴力的排序方法，对于大多数初学者而言，它是很多人接触的第一个排序方法。大致实现思路如下：从下标0开始，不断将两个数字相比较，如果前一个数大于后一个数字，那么就交换位置，直至末尾。外层循环每一轮结束后，就能确定一个值是第`i+1`大的元素，于是后续的元素就不再去交换，所以内层循环的终止条件是`len(slice)-(i+1)`。

下面是一个冒泡排序的泛型实现。

```go
func BubbleSort[T any](s []T, less func(a, b T) bool) {
	for i := 0; i < len(s); i++ {
		for j := 0; j < len(s)-1-i; j++ {
			if less(s[j+1], s[j]) {
				s[j+1], s[j] = s[j], s[j+1]
			}
		}
	}
}
```

**时间复杂度：O(n^2）**

不管情况好坏，它需要交换总共 (n-1)+(n-2)+(n-3)+...+1 次 ，对其进行数列求和为 (n^2-n)/2 ，忽略低阶项则为O(n^2)，即便整个切片已经是完全有序的。

**空间复杂度：O(1）**

算法进行过程中没用到任何的额外空间，所以为O(1)

**性能测试**

对其进行基准测试，分别使用100，1000，1w，10w个随机整数进行排序，测试数据如下

```
goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkBubbleSort/100-16        104742             10910 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSort/1000-16          984           1149239 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSort/10000-16           7         158096014 ns/op               1 B/op          0 allocs/op
BenchmarkBubbleSort/100000-16          1        19641943300 ns/op              0 B/op          0 allocs/op
PASS
ok      sorts   23.037s
```

随着数据量的增多，冒泡排序所耗费的时间差不多是在以平方的级别在增长，到了10w级别的时候，要花费整整18秒才能完成排序，值得注意的是整个过程中没有发生任何的内存分配。百万数据量耗时太久了，就懒得测了。

**优化**

第一个优化点是原版冒泡即便在数据完全有序的情况下依然会去进行比较，所以当一趟循环完后如果发现数据是有序的应该可以直接退出，这是减少外层循环的次数。由于冒泡排序每轮会冒泡一个有序的数据到右边去，所以每轮循环后都会缩小冒泡的范围，假设数据右边已经是有序的了，那么这种操作就可以提前，而不需要等到指定循环次数之后才缩小范围，比如下面这种数据

```
4,1,3,2,5,6,7,8,9
```

这个范围的边界实际上就是上一轮循环最后一次发生交换的下标，这是减少了内循环次数。这里提一嘴使用位运算也可以实现数字交换，算是第三个优化点，但仅限于整数类型。优化后的代码如下

```go
func BubbleSort[T any](s []T, less func(a, b T) bool) {
	// 记录最后一个交换的下标
	last := len(s) - 1
	for i := 0; i < len(s); i++ {
		// 记录整个切片是否已经有序
		isSorted := true
		// 内循环只截至到last
		for j := 0; j < last; j++ {
			if less(s[j+1], s[j]) {
				s[j+1], s[j] = s[j], s[j+1]
				isSorted = false
				last = j
			}
		}

		if isSorted {
			return
		}
	}
}
```

优化只能提高冒泡的平均时间效率，在最差情况下，也就是数据完全逆序/升序的时候，对其进行升序/逆序排序，渐进时间复杂度依旧是O(n^2)。

```
goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkBubbleSort/100-16        104742             10910 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSort/1000-16          984           1149239 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSort/10000-16           7         158096014 ns/op               1 B/op          0 allocs/op
BenchmarkBubbleSort/100000-16          1        19641943300 ns/op              0 B/op          0 allocs/op
BenchmarkBubbleSortPlus/100-16            115183             10537 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSortPlus/1000-16             1090           1092803 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSortPlus/10000-16               8         139880100 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSortPlus/100000-16              1        18904012900 ns/op              0 B/op          0 allocs/op
PASS
ok      sorts   51.565s
```

提升并不是特别明显，因为数据是完全随机的，可能很多生成的数据并没有走到优化点上，这也变相证明了冒泡排序不太适合实际使用。



## 选择排序

选择排序的思路非常的清晰和容易实现，首先在数组的未排序部分找出其中的最大或最小值，也就是然后将最大值或最小值其与数组的中的第i个元素交换位置。第一个交换的一定是第一大或第一小的元素，第二个就是第二大或第二小的元素，这样一来就确认了有序的部分，如此在未排序的部分循环往复，直到整个数组有序。

```go
func SelectSort[T any](s []T, less func(a, b T) bool) {
	for i := 0; i < len(s); i++ {
		minI := i
		for j := i + 1; j < len(s); j++ {
			if less(s[j], s[minI]) {
				minI = j
			}
		}
		s[i], s[minI] = s[minI], s[i]
	}
}
```

**时间复杂度：O(n^2)**

不管在什么情况，在选择排序的过程中，它都会在每轮循环后的未排序部分去比较寻找最大值，所以比较次数为(n-1)+(n-2)+(n-3)....+1差不多就是(n^2+n)/2，所以其时间复杂度为O(n^2)。

**空间复杂度：O(1)**

排序过程中没有用到任何的额外空间来辅助，所以时间复杂度为O(1)。

**性能测试**

```
goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkSelectSort/100-16        109363             10377 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/1000-16         1260            939461 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/10000-16          13          88333308 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/100000-16          1        9028276000 ns/op               0 B/op          0 allocs/op
PASS
ok      sorts   13.263s
```

可以看到的是选择排序在10w数据量时选择排序花费的时间是冒泡的一半左右，这是因为冒泡每轮循环交换的次数比较多，而选择排序每轮循环只交换一次，总体上从时间来说是优于冒泡排序的。

**优化**

原版选择排序只会在切片的左边构建有序部分，在右边无序的部分去寻找最大或最小值，既然反正都是在无序部分寻找最大/最小值，那就可以在切片左右两边都构建有序区，假设是升序排序，左边是最小，右边是最大，中间就是无序区，这样一来就可以减少差不多一半的比较次数。优化后的代码如下

```go
func SelectSort[T any](s []T, less func(a, b T) bool) {
	// 记录左右两边的边界
	l, r := 0, len(s)-1
	for l < r {
		minI, maxI := l, r
		for j := l; j <= r; j++ {
			if less(s[j], s[minI]) {
				minI = j
			}

			if !less(s[j], s[maxI]) {
				maxI = j
			}
		}

		// 没找到就没必要交换
		if minI != l {
			s[minI], s[l] = s[l], s[minI]

			// 如果maxI==l，说明maxI上已经不是原来的那个值了
			// 因为l和minI已经交换过了，此时的l就是minI，所以要纠正一下
			if l == maxI {
				maxI = minI
			}
		}

		if maxI != r {
			s[maxI], s[r] = s[r], s[maxI]
		}

		// 缩小边界
		l++
		r--
	}
}
```

这样一来，这样一来只需要看一边的比较次数就够了，不严谨的来说就是(n/2-1)+(n/2-2)+(n/2-3)...，最后时间复杂度依旧是O(n^2)，不过优化的时间效率上会有所提升。

```
goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkSelectSort/100-16        109363             10377 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/1000-16         1260            939461 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/10000-16          13          88333308 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/100000-16          1        9028276000 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSortPlus/100-16            133096              8826 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSortPlus/1000-16             1447            794633 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSortPlus/10000-16              14          77494886 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSortPlus/100000-16              1        7745074200 ns/op               0 B/op          0 allocs/op
PASS
ok      sorts   29.479s
```

通过数据对比可以看到，在时间效率上大概提升了接近10-20%左右。



## 插入排序

插入排序也是一种比较简单的排序方法，其基本思路为：假设0 ...i的元素已经有序，使用`s[i+1]`逆向与前i+1个元素进行逐个比较，如果在比较过程中第j个元素比第i+1个元素小/大，那么将其后移，如此循环往复，直到找到第一个大于/小于`s[i+1]`下标元素的元素时或者下标为0时，考虑到比`s[i]`小/大的元素都已经后移了，所以直接`s[i]`的值覆盖到`s[j+1]`上。

```go
func InsertSort[T any](s []T, less func(a, b T) bool) {
	for i := 1; i < len(s); i++ {
		item := s[i]
		j := i
		for j = i - 1; j >= 0; j-- {
			if less(item, s[j]) {
				s[j+1] = s[j]
			}
		}
		s[j+1] = item
	}
}
```

**时间复杂度：O(n^2)**

如果是要升序排列，在最好情况下，要排序的切片已经是完全升序的了，那么只需要进行n-1次比较操作。最坏情况就是完全降序，那么就需要n+(n-1)+(n-2)+......+1次比较，总共就是(n^2+n)/2次。

**空间复杂度：O(1)**

整个过程中未用到额外的辅助空间

**性能测试**

```
goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkInsertSort/100-16        127532              8925 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/1000-16         1611            736531 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/10000-16          15          71716213 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/100000-16          1        7104786500 ns/op               0 B/op          0 allocs/op
PASS
ok      sorts   11.312s
```

**优化**

插入排序的优化方案很容易想到，假设是升序排列，在确保前n个元素已经是有序的情况下，我们需要去一个个遍历找到第一个小于`s[n+1]`的元素，既然它是有序的，那就可以使用二分查找来进行操作，然后再移动元素。移动次数没有减少，但比较次数减少了相当的多。优化后的代码如下

```go
func InsertSortPlus[T any](s []T, less func(a, b T) bool) {
	for i := 1; i < len(s); i++ {
		target := s[i]
		// 对有序部分进行二分
		l, r := 0, i-1
		for l <= r {
			mid := l + (r-l)/2
			if less(target, s[mid]) {
				r = mid - 1
			} else {
				l = mid + 1
			}
		}

		// 移动元素
		for j := i - 1; j >= l; j-- {
			s[j+1] = s[j]
		}
		s[l] = target
	}
}
```

看看优化后的性能

```
goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkInsertSort/100-16        127532              8925 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/1000-16         1611            736531 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/10000-16          15          71716213 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/100000-16          1        7104786500 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSortPlus/100-16            399487              2820 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSortPlus/1000-16             7941            187614 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSortPlus/10000-16              79          13721910 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSortPlus/100000-16              1        1290984000 ns/op               0 B/op          0 allocs/op
PASS
ok      sorts   28.564s
```

可以看到使用了二分的插入排序性能整整比原版提升了足足有70-80%左右，这已经是非常巨大的提升了。在最好的情况下，如果切片本身就是全部有序的话，就不需要移动元素，那么就只有查找会消耗时间，这样一来它的时间复杂度可以接近O(nlogn)。在最差的情况，每次都需要移动i-1个元素，那么就是(log(n-1)+n-1)+(log(n-2)+n-2)+(log(n-3)+n-3)....，当n足够大时，logn产生的影响已经微不足道了，虽然没有经过严格的计算，但简单估算下它的时间复杂度依旧不会小于O(n^2)。

不过值得高兴的是，到目前为止总算有一个方法能够有突破O(n^2)的可能性。



## 希尔排序



## 归并排序



## 快速排序



## 计数排序



## 基数排序



## 桶排序



## 堆排序
