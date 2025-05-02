<?php
$file = "visits.txt";

// تحقق إن الملف موجود، وإن لم يكن أنشئه
if (!file_exists($file)) {
    file_put_contents($file, "0");
}

// اقرأ العدد الحالي
$count = (int)file_get_contents($file);

// أضف زيارة جديدة
$count++;

// احفظ العدد الجديد
file_put_contents($file, $count);

// (اختياري) اطبع العدد
echo $count;
?>
