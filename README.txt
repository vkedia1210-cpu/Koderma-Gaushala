Shri Koderma Gaushala Samiti - website files (PHP/HTML)

* Each page is a folder with an index.html, e.g. /chara-seva/index.html is the Chara Seva page.
  Text can be edited in hPanel > File manager > open the page's index.html. English text sits in
  class="lang-en" and the Hindi version right after it in class="lang-hi"; change both.
* Pictures and videos: /assets/img and /assets/video. Styles: /assets/css/site.css.
* Forms post to send.php. Messages are saved in the folder kg-enquiries (one level above public_html
  if the server allows, otherwise inside public_html/kg-enquiries) as enquiries.csv, which opens in Excel.
  To also get them by email, put an address in config.php ('email' => 'office@example.com').
* Phone, WhatsApp and bank details appear on many pages; the WhatsApp number used by forms is in config.php.
