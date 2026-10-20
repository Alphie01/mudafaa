/**
 * `record[key]`'i yalnızca `key` kaydın kendi özelliğiyse okur; yoksa `undefined` döner. İçerik kimlikleri
 * `constructor`, `toString` gibi sözcükler de olabilir; düz nesneden doğrudan okuma bunları `Object.prototype`'tan
 * kalıtılmış üye olarak (ör. `Object` işlevi) döndürür ve yok olması gereken bir değeri "var" gösterirdi (Ruling 18).
 * Oturum durumunun kimlik anahtarlı her kaydı (`vars`, `evidence`, `characters`, `visits`, `uses`, `found`…) bu
 * yardımcıyla okunur; tanımlar ise `CompiledCase`'in `Map`'lerinden gelir. Durum JSON'a serileştirilebilir kaldığı için
 * `Map` yerine düz kayıt kullanılır.
 */
export function getOwn<T>(record: Readonly<Record<string, T>>, key: string): T | undefined {
  return Object.hasOwn(record, key) ? record[key] : undefined;
}
