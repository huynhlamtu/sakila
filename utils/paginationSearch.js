const db = require("./db");
const { PAGE_SIZE } = require("../config/pagination.json");

module.exports = paginate = async (
  current_page = 1,
  TBL_NAME,
  COL_NAME,
  query
) => {
  const pagination = {};
  if (current_page < 1) current_page = 1;
  const offset = (current_page - 1) * +PAGE_SIZE;

  const raw = `MATCH(${COL_NAME}) AGAINST('${query}')`;
  const total = await db
    .count("* as count")
    .from(TBL_NAME)
    .whereRaw(`${raw}`)
    .first();

  console.log(total.count);

  const total_page = Math.ceil(total.count / PAGE_SIZE);

  if (current_page > total_page) {
    return `Invalid page! The last page of the search is ${total_page}`;
  }

  const rows = await db(TBL_NAME)
    .offset(offset)
    .limit(PAGE_SIZE)
    .whereRaw(`${raw}`);

  pagination.total = total.count;
  pagination.pageSize = PAGE_SIZE;
  pagination.total_page = total_page;
  pagination.from = offset;
  pagination.to = offset + rows.length;
  pagination.current_page = current_page;
  pagination.data = rows;
  return pagination;
};
