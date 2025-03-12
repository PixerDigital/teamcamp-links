import { prismaEdge } from "@dub/prisma/edge";
import { punyEncode } from "@dub/utils";
import {
  encodeKey,
  isCaseSensitiveDomain,
} from "../api/links/case-sensitivity";

export const checkIfKeyExists = async ({
  domain,
  key,
  ignoreCaseSensitivity = false,
}: {
  domain: string;
  key: string;
  ignoreCaseSensitivity?: boolean;
}) => {
  const isCaseSensitive = isCaseSensitiveDomain(domain);
  const keyToQuery =
    isCaseSensitive && !ignoreCaseSensitivity
      ? // for case sensitive domains, we need to encode the key
        encodeKey(key)
      : // for non-case sensitive domains, we need to make sure that the key is always URI-decoded + punycode-encoded
        // (cause that's how we store it in MySQL)
        punyEncode(decodeURIComponent(key));

  const link = await prismaEdge.link.findFirst({
    where: { domain, key: keyToQuery },
  });
  return !!link;
};
