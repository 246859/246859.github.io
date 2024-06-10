---
date: 2024-06-10
article: true
star: false
sticky: false
category:
  - python
tag:
  - python
  - pypi
  - twine
---

# 在Pypi上发布自己的项目

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202406101805061.png)
<!-- more -->
---
最近在用到一个python库的时候，发现了一个bug，看了看原仓库上次更新都是2022年了，估计我提了PR也不会被合并，于是我打算自己修复发布成一个新的包，此前没有了解过这些方面的知识，于是顺便写了这篇文章做一个记录。

官方教程：[Packaging Python Projects - Python Packaging User Guide](https://packaging.python.org/en/latest/tutorials/packaging-projects/)



## PyPI

官网：[PyPI · The Python Package Index](https://pypi.org/)

第一步是在PyPI上注册一个自己的账号，然后申请一个API Token，这个Token就是专门用来上传软件包的。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202406101815258.png)

你可以在`username/Account settings/API tokens`位置找到有关Token的内容，现在的话申请Token必须要2FA认证，可以用自己喜欢的2FA应用来完成认证，在成功创建后，Token只会显示一次，为了后续方便使用，建议将其保存到本地的文件中，保存位置为`user/.pypirc`文件中。

```
[pypi]
  username = your_name
  password = pypi-token
```

后续在用到的时候就会自动读取，不需要手动认证。



## 规范

对于一个规范的项目而言，应该有如下几样东西

- LICENSE，开源证书
- README，基本的文档
- `setup.py`，打包用的清单文件

其它都还好，主要来讲讲这个`setup.py`，由于它稍微有点复杂，可以通过`pyproject.toml`配置文件来替代，不过其灵活性不如前者，比如下面是一个TOML的例子

```toml
[project]
name = "example_package_YOUR_USERNAME_HERE"
version = "0.0.1"
authors = [
  { name="Example Author", email="author@example.com" },
]
description = "A small example package"
readme = "README.md"
requires-python = ">=3.8"
classifiers = [
    "Programming Language :: Python :: 3",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
]

[project.urls]
Homepage = "https://github.com/pypa/sampleproject"
Issues = "https://github.com/pypa/sampleproject/issues"
```

通过配置文件可以很直观的了解到这些信息，不过稍微旧一点的项目都是使用`setup.py`来管理的，下面看一个`setup.py`的例子，该例子由知名开源作者`kennethreitz`提供

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Note: To use the 'upload' functionality of this file, you must:
#   $ pipenv install twine --dev

import io
import os
import sys
from shutil import rmtree

from setuptools import find_packages, setup, Command

# Package meta-data.
NAME = 'mypackage'
DESCRIPTION = 'My short description for my project.'
URL = 'https://github.com/me/myproject'
EMAIL = 'me@example.com'
AUTHOR = 'Awesome Soul'
REQUIRES_PYTHON = '>=3.6.0'
VERSION = '0.1.0'

# What packages are required for this module to be executed?
REQUIRED = [
    # 'requests', 'maya', 'records',
]

# What packages are optional?
EXTRAS = {
    # 'fancy feature': ['django'],
}

# The rest you shouldn't have to touch too much :)
# ------------------------------------------------
# Except, perhaps the License and Trove Classifiers!
# If you do change the License, remember to change the Trove Classifier for that!

here = os.path.abspath(os.path.dirname(__file__))

# Import the README and use it as the long-description.
# Note: this will only work if 'README.md' is present in your MANIFEST.in file!
try:
    with io.open(os.path.join(here, 'README.md'), encoding='utf-8') as f:
        long_description = '\n' + f.read()
except FileNotFoundError:
    long_description = DESCRIPTION

# Load the package's __version__.py module as a dictionary.
about = {}
if not VERSION:
    project_slug = NAME.lower().replace("-", "_").replace(" ", "_")
    with open(os.path.join(here, project_slug, '__version__.py')) as f:
        exec(f.read(), about)
else:
    about['__version__'] = VERSION


class UploadCommand(Command):
    """Support setup.py upload."""

    description = 'Build and publish the package.'
    user_options = []

    @staticmethod
    def status(s):
        """Prints things in bold."""
        print('\033[1m{0}\033[0m'.format(s))

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        try:
            self.status('Removing previous builds…')
            rmtree(os.path.join(here, 'dist'))
        except OSError:
            pass

        self.status('Building Source and Wheel (universal) distribution…')
        os.system('{0} setup.py sdist bdist_wheel --universal'.format(sys.executable))

        self.status('Uploading the package to PyPI via Twine…')
        os.system('twine upload dist/*')

        self.status('Pushing git tags…')
        os.system('git tag v{0}'.format(about['__version__']))
        os.system('git push --tags')

        sys.exit()


# Where the magic happens:
setup(
    name=NAME,
    version=about['__version__'],
    description=DESCRIPTION,
    long_description=long_description,
    long_description_content_type='text/markdown',
    author=AUTHOR,
    author_email=EMAIL,
    python_requires=REQUIRES_PYTHON,
    url=URL,
    packages=find_packages(exclude=["tests", "*.tests", "*.tests.*", "tests.*"]),
    # If your package is a single module, use this instead of 'packages':
    # py_modules=['mypackage'],

    # entry_points={
    #     'console_scripts': ['mycli=mymodule:cli'],
    # },
    install_requires=REQUIRED,
    extras_require=EXTRAS,
    include_package_data=True,
    license='MIT',
    classifiers=[
        # Trove classifiers
        # Full list: https://pypi.python.org/pypi?%3Aaction=list_classifiers
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: Implementation :: CPython',
        'Programming Language :: Python :: Implementation :: PyPy'
    ],
    # $ setup.py publish support.
    cmdclass={
        'upload': UploadCommand,
    },
)
```

该文件中主要是通过`setup`函数来进行管理，除了这个函数之外其它都是锦上添花的东西，根据你的需求去填写关键字参数即可。



## 打包

首先安装打包工具

```bash
python3 -m pip install --upgrade build
```

然后在项目根目录下执行，会在dist目录下生成tar.gz压缩文件

```
python setup.py sdist build
```

然后安装上传工具`twine`

```
python3 -m pip install --upgrade twine
```

使用时只需要指定目录和项目名即可

```
python3 -m twine upload --repository testpypi dist/*
```

```
Uploading distributions to https://test.pypi.org/legacy/
Enter your username: __token__
Uploading example_package_YOUR_USERNAME_HERE-0.0.1-py3-none-any.whl
100% ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 8.2/8.2 kB • 00:01 • ?
Uploading example_package_YOUR_USERNAME_HERE-0.0.1.tar.gz
100% ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 6.8/6.8 kB • 00:00 • ?
```

由于前面在`.pypirc`文件中配置了token，这里会自动读取，不需要输入。



## 测试

如果要测试的话，最好不要使用pip镜像，因为它们同步不及时，建议指定`-i https://pypi.org/simple/`官方源。

```
pip install -i https://pypi.org/simple/ your_package==version
```



