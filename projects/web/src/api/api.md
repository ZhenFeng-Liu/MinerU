1.下载下載原始PDF接口

GET  http://192.168.0.111:5173/api/v2/analysis/pdf_original?as_attachment=true&pdf=20250424104128669_UI__8-13K_5.pdf

Query 请求参数示例：

{
    as_attachment: "true" // String
    pdf: "20250424104128669_UI__8-13K_5.pdf" // String
}


2.创建人才库条目

POST http://192.168.0.111:5173/api/v2/talentpool/handler

Body 请求参数示例:

{
    "name":"easy",
    "gender":"男",
    "phone":"12324579560",
    "job":"开发工程师",
    "channel":"boss直聘",
    "statue":"已通過",
    "inputer":"你爺爺",
    "analysis_task_id":1
}

3.修改人才库条目

PUT http://192.168.0.111:5173/api/v2/talentpool/handler

Body 请求参数

{
    "id":1,
    "name":"easssy",
    "gender":"男sss",
    "phone":"1232sds4579560",
    "job":"开发工das程师",
    "channel":"bsadaoss直聘",
    "statue":"已asda通過",
    "inputer":"你asfda爺爺",
    "analysis_task_id":2
}

4.删除/批量删除人才库条目

DELETE http://192.168.0.111:5173/api/v2/talentpool/handler

Body 请求参数

{
    "ids": [1, 2, 3]
}

5.批量修改候选人状态

PATCH http://192.168.0.111:5173/api/v2/talentpool/handler

Body 请求参数

{
    "ids":[2,3],
    "statue":"sssss"
}

6.查询人才库条目

GET http://192.168.0.111:5173/api/v2/talentpool/handler?id=2&keyword=dasdsada&statue=sda&page=1&per_page=10&start_date=2025-04-24&end_date=2025-04-24

Query 请求参数

{
    id: '2' // String
    keyword: 'dasdsada' // String
    statue: 'sda' // String
    page: '1' // String
    per_page: '10' // String
    start_date: '2025-04-24' // String
    end_date: '2025-04-24' // String
}