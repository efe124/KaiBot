# Kai Bot

## Açıklama
Impeccably Code Jam: 2023 için 72 saatte Efe#1281 tarafından yapıldı. 3 Adet mini oyuna ve bu oyunların kaydını tutma özelliğine sahip bir bottur.

## Komutlar
|Komut|Açıklama|Kullanış|Gereken İzinler|
|-|-|-|-|
|/x-i-bul|Yeni bir "X'i bul oyunu başlat"|/x-i-bul
|/oyun-logları kanal|Oyun kayıtları için bir kanal belirle|/oyun-logları kanal \[kanal:[TextChannel](https://discord.js.org/#/docs/discord.js/main/class/TextChannel)\] | Sunucuyu Yönet,Kanalları Yönet
|/oyun-logları incele| Bir oyun kaydını ID'sinden bularak incele| /oyun-logları incele \<id:[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\>|Sunucuyu Yönet,Kanalları Yönet
|/oyun-logları indir| Oyun kayıtlarını dosya olarak indir ve temizle| /oyun-logları indir|Sunucuyu Yönet,Kanalları Yönet
|/oyun-logları temizle | Oyun kayıtlarını temizler | /oyun-logları temizle|Sunucuyu Yönet,Kanalları Yönet
|/adam-asmaca|Yeni bir "Adam Asmaca" oyunu başlat|/adam-asmaca
|/istatistikler|Oyunlardaki istatistiklerini gör|/istatistikler
|/kelime|Yeni bir "Kelime" oyunu başlat|/kelime
|/hakkında|Bot hakkında bilgi
|/yazı-tura|Yazı Tura oyunu oyna|/yazı-tura \<tahmin:Yazı\|Tura\>
|/taş-kağıt-makas|Taş Kağıt Makas oyunu oyna|/taş-kağıt-makas \<seçim:Taş\|Kağıt\|Makas>

## Oyunlar
|Oyun|Nasıl Oynanır|Komut|
|-|-|-|
|Adam Asmaca|Klasik adam asmaca. 5 Harfli bir kelimeyi harflerini veya kendisini tahmin ederek bulmaya çalış. Her yanlış harf tahmininde adamın bir uvuzu daha asılacak. Bütün adam asılırsa kaybedersin. Bütün kelimeyi bulursan kaznırsın.|/adam-asmaca
|Kelime|5 Harfli bir kelimeyi tahmin etmeye çalış. Her tahmin doğru kelime için ipuçları oluşturacak. 5 Deneme hakkınıda kaybetmeden kelimeyi tahmin edebilirsen kazanırsın.|/kelime
|X'i Bul|Rastgele oluşan 8x8 bir alanın sol üstünde başla. Sağ alttaki X'e 25 adım içerisinde bloklara çarpmadan ulaşmaya çalış (13 adım ile ulaşmak mümkün). X'e ulaşırsan kazanırsın|/x-i-bul