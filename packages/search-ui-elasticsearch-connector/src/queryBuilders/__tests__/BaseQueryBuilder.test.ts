import { BaseQueryBuilder } from "../BaseQueryBuilder";
import type { RequestState } from "@elastic/search-ui";

describe("BaseQueryBuilder", () => {
  class TestQueryBuilder extends BaseQueryBuilder {
    getSearchTerm(): string {
      return "test";
    }

    getSize(): number {
      return 10;
    }

    getFrom(): number {
      return 0;
    }

    async build() {
      return {};
    }
  }

  const baseRequestState: RequestState = {
    searchTerm: "test",
    current: 1,
    resultsPerPage: 10
  };

  it("should create instance with default values", () => {
    const builder = new TestQueryBuilder(baseRequestState);
    expect(builder).toBeInstanceOf(BaseQueryBuilder);
  });

  it("should get search term", () => {
    const builder = new TestQueryBuilder(baseRequestState);
    expect(builder.getSearchTerm()).toBe("test");
  });

  it("should get size", () => {
    const builder = new TestQueryBuilder(baseRequestState);
    expect(builder.getSize()).toBe(10);
  });

  it("should get from", () => {
    const builder = new TestQueryBuilder(baseRequestState);
    expect(builder.getFrom()).toBe(0);
  });
});
