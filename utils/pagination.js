const db = require("./db");
const { PAGE_SIZE } = require("../config/pagination.json");

module.exports = paginate = async (current_page = 1, TBL_NAME) => {
  const pagination = {};
  if (current_page < 1) current_page = 1;
  const offset = (current_page - 1) * +PAGE_SIZE;

  const total = await db.count("* as count").from(TBL_NAME).first();
  const total_page = Math.ceil(total.count / PAGE_SIZE);

  if (current_page > total_page) {
    throw new Error(`Invalid page! The last page is ${total_page}`);
  }

  const rows = await db
    .select("*")
    .from(TBL_NAME)
    .offset(offset)
    .limit(PAGE_SIZE);

  pagination.total = total.count;
  pagination.pageSize = PAGE_SIZE;
  pagination.total_page = total_page;
  pagination.from = offset;
  pagination.to = offset + rows.length;
  pagination.current_page = current_page;
  pagination.data = rows;
  return pagination;
};
