<header class="hdr" id="hdr">
  <div class="wrap">
    <a class="brand" href="<?php echo esc_url( ofri_link( 'home' ) ); ?>" aria-label="עפרי גיספאן – לדף הבית">
      <b>עפרי גיספאן</b>
      <small>טיפול עומק רגשי-תודעתי</small>
    </a>
    <nav class="nav" aria-label="ניווט ראשי">
      <div class="dd">
        <button class="dd-btn" id="ddAboutBtn" type="button" aria-expanded="false" aria-controls="ddAbout" data-cur="about,stories,press">עליי <svg aria-hidden="true"><use href="#i-down"/></svg></button>
        <div class="dd-panel" id="ddAbout" hidden>
          <a href="<?php echo esc_url( ofri_link( 'about' ) ); ?>">עליי<small>הדרך שלי, ניסיון והכשרה</small></a>
          <a href="<?php echo esc_url( ofri_link( 'stories' ) ); ?>">מטופלים מספרים<small>סיפורים והמלצות</small></a>
          <a href="<?php echo esc_url( ofri_link( 'press' ) ); ?>">מהתקשורת<small>כתבות וראיונות</small></a>
        </div>
      </div>
      <a href="<?php echo esc_url( ofri_link( 'method' ) ); ?>" data-nav="method">טיפול רגשי-תודעתי</a>
      <div class="dd">
        <button class="dd-btn" id="ddBtn" type="button" aria-expanded="false" aria-controls="ddPanel" data-cur="women,parents,couples,spirit">למי אני עוזרת <svg aria-hidden="true"><use href="#i-down"/></svg></button>
        <div class="dd-panel" id="ddPanel" hidden>
          <a href="<?php echo esc_url( ofri_link( 'women' ) ); ?>">נשים וגברים באמצע החיים<small>כשהזוגיות, הקריירה או הגוף מבקשים שינוי</small></a>
          <a href="<?php echo esc_url( ofri_link( 'parents' ) ); ?>">הורים ובני נוער<small>לחזור לחיבור, להבנה ולשקט בבית</small></a>
          <a href="<?php echo esc_url( ofri_link( 'couples' ) ); ?>">זוגות<small>למצוא שוב את השפה המשותפת</small></a>
          <a href="<?php echo esc_url( ofri_link( 'spirit' ) ); ?>">התפתחות אישית<small>לפגוש את עצמך באמת</small></a>
        </div>
      </div>
      <div class="dd">
        <button class="dd-btn" id="ddApprBtn" type="button" aria-expanded="false" aria-controls="ddAppr" data-cur="approaches">גישות טיפול <svg aria-hidden="true"><use href="#i-down"/></svg></button>
        <div class="dd-panel" id="ddAppr" hidden>
          <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-journey' ) ); ?>">המסע<small>חיבור לתת המודע ולמקור התבונה</small></a>
          <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-parents' ) ); ?>">הורות מודעת<small>הדרכת הורים</small></a>
          <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-inner' ) ); ?>">חיבור לילד הפנימי<small>דיאלוג פנימי</small></a>
          <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-arts' ) ); ?>">טיפול באמנויות<small>לבני ובנות נוער</small></a>
          <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-const' ) ); ?>">קונסטלציה משפחתית<small>אישי וקבוצתי</small></a>
          <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-rebirth' ) ); ?>">תרפיה בהיזכרות עמוקה<small>לידה מחדש</small></a>
          <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-ifs' ) ); ?>">עבודה עם חלקים (IFS)<small>טיפול אישי</small></a>
        </div>
      </div>
      <a href="<?php echo esc_url( ofri_link( 'blog' ) ); ?>" data-nav="blog">בלוג</a>
      <a href="<?php echo esc_url( ofri_link( 'contact' ) ); ?>" data-nav="contact">צרו קשר</a>
    </nav>
    <div class="hdr-actions">
      <a class="hdr-phone" href="tel:+972507681816"><svg aria-hidden="true"><use href="#i-phone"/></svg><span class="ltr">050-7681816</span></a>
      <a class="btn btn-primary btn-sm hdr-cta" data-wa href="https://wa.me/972507681816">לתיאום שיחה</a>
      <a class="hdr-call" href="tel:+972507681816" aria-label="להתקשר לעפרי: 050-7681816"><svg aria-hidden="true"><use href="#i-phone"/></svg></a>
      <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="mnav"><span aria-hidden="true"><i></i><i></i><i></i></span>תפריט</button>
    </div>
  </div>
</header>

<div class="mnav" id="mnav" hidden role="dialog" aria-modal="true" aria-label="תפריט">
  <div class="mnav-top">
    <a class="brand" href="<?php echo esc_url( ofri_link( 'home' ) ); ?>"><b>עפרי גיספאן</b><small>טיפול עומק רגשי-תודעתי</small></a>
    <button class="mnav-close" id="menuClose" type="button">סגירה</button>
  </div>
  <div class="mnav-links">
    <a href="<?php echo esc_url( ofri_link( 'home' ) ); ?>">דף הבית</a>
    <a href="<?php echo esc_url( ofri_link( 'about' ) ); ?>">עליי</a>
    <a href="<?php echo esc_url( ofri_link( 'method' ) ); ?>">טיפול רגשי-תודעתי</a>
    <p class="mnav-label">למי אני עוזרת</p>
    <div class="mnav-aud">
      <a href="<?php echo esc_url( ofri_link( 'women' ) ); ?>">נשים וגברים באמצע החיים</a>
      <a href="<?php echo esc_url( ofri_link( 'parents' ) ); ?>">הורים ובני נוער</a>
      <a href="<?php echo esc_url( ofri_link( 'couples' ) ); ?>">זוגות</a>
      <a href="<?php echo esc_url( ofri_link( 'spirit' ) ); ?>">התפתחות אישית</a>
    </div>
    <p class="mnav-label">גישות טיפול</p>
    <div class="mnav-aud mnav-appr">
      <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-journey' ) ); ?>">המסע</a>
      <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-parents' ) ); ?>">הורות מודעת</a>
      <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-inner' ) ); ?>">חיבור לילד הפנימי</a>
      <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-arts' ) ); ?>">טיפול באמנויות</a>
      <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-const' ) ); ?>">קונסטלציה משפחתית</a>
      <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-rebirth' ) ); ?>">תרפיה בהיזכרות עמוקה</a>
      <a href="<?php echo esc_url( ofri_link( 'approaches', 'a-ifs' ) ); ?>">עבודה עם חלקים (IFS)</a>
    </div>
    <a href="<?php echo esc_url( ofri_link( 'stories' ) ); ?>">מטופלים מספרים</a>
    <a href="<?php echo esc_url( ofri_link( 'press' ) ); ?>">מהתקשורת</a>
    <a href="<?php echo esc_url( ofri_link( 'blog' ) ); ?>">בלוג</a>
    <a href="<?php echo esc_url( ofri_link( 'contact' ) ); ?>">צרו קשר</a>
  </div>
  <div class="cta-row">
    <a class="btn btn-primary btn-lg" data-wa href="https://wa.me/972507681816"><svg aria-hidden="true"><use href="#i-chat"/></svg>לתיאום שיחה</a>
    <a class="btn btn-quiet btn-lg" href="tel:+972507681816"><svg aria-hidden="true"><use href="#i-phone"/></svg><span class="ltr">050-7681816</span></a>
  </div>
  <p class="where">בקליניקה בקדימה-צורן או אונליין בזום</p>
</div>
