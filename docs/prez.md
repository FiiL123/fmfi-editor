---
theme: default
marp: true
class:
    - invert
---

# Editor mapových dát pre Sprievodcu FMFI

### Filip Sršeň
Školiteľ: Ing. Alexander Šimko PhD.

-----

# FMFI GUIDE

![width:400px bg right](https://play-lh.googleusercontent.com/KZxuWTZbtrtLZr4hWJVXDqMUfNykiCS9BnrH0e5xL6XkNwdaI1zQLWpjU9uEEdJ0NQ=w2560-h1440-rw)

-----

# Mapové dáta

```xml
<part dx="684" dy="122" level="0" scalex="1.2878" scaley="1.4405" pavilion="pavilion-i">

    <label id="l-0-i-17" text="I - Informatics" x="100" y="-100"/>

    ...

    <!-- H-6 -->
    <room id="H-6" important="true" number="H 6" purpose="computer" capacity="56" vertex="v-0-i-h-6">
        <rectangle x1="232" x2="430" y1="450" y2="625"/>
    </room>

    <door id="d-0-i-73">
        <line x1="430" x2="430" y1="517" y2="551"/>
    </door>
```

-----

# Cieľ

Vytvorenie vizuálneho editoru pre FMFI Guide, kde sú zmeny viditeľné v reálnom čase.



-----

# Implmentácia

* webová aplikácia
* django
* konva.js

-----
# Aktuálny stav

![](https://www.webpagescreenshot.info/image-url/6o-bqoBXm)

-----

# Ďakujem za pozornosť 

-----

# Otázky 