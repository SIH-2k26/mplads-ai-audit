export type SupportedLanguage =
  | 'ur' // Urdu (اردو - RTL)
  | 'en' // English (Default)
  | 'hi' // Hindi (हिन्दी)
  | 'mr' // Marathi (मराठी)
  | 'bn' // Bengali (বাংলা)
  | 'ta' // Tamil (தமிழ்)
  | 'te' // Telugu (తెలుగు)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'as' // Assamese (অসমীয়া)
  | 'sd' // Sindhi (سنڌي - RTL)
  | 'sa' // Sanskrit (संस्कृतम्)
  | 'ne' // Nepali (नेपाली)
  | 'kok' // Konkani (कोंकणी)
  | 'mai' // Maithili (मैथिली)
  | 'doi' // Dogri (डोगरी)
  | 'brx' // Bodo (बड़ो)
  | 'mni' // Manipuri / Meitei (মৈতৈলোন)
  | 'ks' // Kashmiri (کٲشُر / کشمیری)
  | 'sat'; // Santali (ᱥᱟᱱᱛᱟᱲᱤ)

export interface LanguageInfo {
  code: SupportedLanguage;
  nativeName: string;
  englishName: string;
  script: string;
  dir: 'ltr' | 'rtl';
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', script: 'Perso-Arabic', dir: 'rtl', region: 'All-India / Official' },
  { code: 'en', nativeName: 'English', englishName: 'English', script: 'Latin', dir: 'ltr', region: 'National / Official' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', script: 'Devanagari', dir: 'ltr', region: 'Northern / Central India' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', script: 'Devanagari', dir: 'ltr', region: 'Maharashtra / Western India' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', script: 'Bengali', dir: 'ltr', region: 'West Bengal / Eastern India' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', script: 'Tamil', dir: 'ltr', region: 'Tamil Nadu / Southern India' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', script: 'Telugu', dir: 'ltr', region: 'Andhra Pradesh / Telangana' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati', script: 'Gujarati', dir: 'ltr', region: 'Gujarat / Western India' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', script: 'Kannada', dir: 'ltr', region: 'Karnataka / Southern India' },
  { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam', script: 'Malayalam', dir: 'ltr', region: 'Kerala / Southern India' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', script: 'Gurmukhi', dir: 'ltr', region: 'Punjab / Northern India' },
  { code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia', script: 'Odia', dir: 'ltr', region: 'Odisha / Eastern India' },
  { code: 'as', nativeName: 'অসমীয়া', englishName: 'Assamese', script: 'Assamese', dir: 'ltr', region: 'Assam / North-East India' },
  { code: 'sd', nativeName: 'سنڌي', englishName: 'Sindhi', script: 'Perso-Arabic', dir: 'ltr', region: 'Western / All-India' },
  { code: 'sa', nativeName: 'संस्कृतम्', englishName: 'Sanskrit', script: 'Devanagari', dir: 'ltr', region: 'Classical / All-India' },
  { code: 'ne', nativeName: 'नेपाली', englishName: 'Nepali', script: 'Devanagari', dir: 'ltr', region: 'Sikkim / Northern Bengal' },
  { code: 'kok', nativeName: 'कोंकणी', englishName: 'Konkani', script: 'Devanagari', dir: 'ltr', region: 'Goa / Konkan Coast' },
  { code: 'mai', nativeName: 'मैथिली', englishName: 'Maithili', script: 'Devanagari', dir: 'ltr', region: 'Bihar / Eastern India' },
  { code: 'doi', nativeName: 'डोगरी', englishName: 'Dogri', script: 'Devanagari', dir: 'ltr', region: 'Jammu & Kashmir' },
  { code: 'brx', nativeName: 'बड़ो', englishName: 'Bodo', script: 'Devanagari', dir: 'ltr', region: 'Assam / Bodoland' },
  { code: 'mni', nativeName: 'মৈতৈলোন', englishName: 'Manipuri / Meitei', script: 'Meitei / Bengali', dir: 'ltr', region: 'Manipur / North-East' },
  { code: 'ks', nativeName: 'کٲشُر', englishName: 'Kashmiri', script: 'Perso-Arabic', dir: 'ltr', region: 'Jammu & Kashmir' },
  { code: 'sat', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', englishName: 'Santali', script: 'Ol Chiki', dir: 'ltr', region: 'Jharkhand / Odisha' },
];
