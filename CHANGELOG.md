# Patch#1
* **Added** `X`,`Q`,`W` harfleri için /adam-asmaca resimleri eklendi:
* * X - `images/hangman/x.png`
* * Q - `images/hangman/q.png`
* * W - `images/hangman/w.png`
* **Added** Yeni komut: /repo - buraya yönlendirir.
* **Changed** Artık 5 değil 3 seviye başına kademe atlanıyor. Buna göre düzenlenen yeni kademe listesi:

  |**Seviye**|**Kademe**|
  |-|-|
  |0-3|Kademesiz|
  |3-6|Demir I|
  |6-9|Demir II|
  |9-12|Demir III|
  |12-15|Bronz I|
  |15-18|Bronz II|
  |18-21|Bronz III|
  |21-24|Altın I|
  |24-27|Altın II|
  |27-30|Altın III|
  |30+|Usta|

* **Changed** /hakkında güncellendi, Botun Jam'de 2. olduğu ve şuanki sürümünün değiştirildiği belirtildi.
* **Fixed** Dil dosyasından dolayı /kelime'nin bitmemesi düzeltildi.
* **Fixed** İngilizce adam asmacada `X`,`Q`,`W` harflerinin hataya sebep olması düzeltildi.
* **Reset** Veri tabanı quick.db üzerine kurulduğu için zorunlu olarak sıfırlandı.

# Patch#2
* **Changed** /x-i-bul'un harita oluşturma algoritması değiştirildi: Artık oyuncu ve X herhangi bir yerde olabilir, yan yana bile.