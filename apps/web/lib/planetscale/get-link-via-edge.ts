import { prismaEdge } from "@dub/prisma/edge";
import { punyEncode } from "@dub/utils";
import {
  decodeKeyIfCaseSensitive,
  encodeKey,
  isCaseSensitiveDomain,
} from "../api/links/case-sensitivity";
import { EdgeLinkProps } from "./types";

export const getLinkViaEdge = async ({
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

  const linkData = await prismaEdge.link.findFirst({
    where: { domain, key: keyToQuery },
  });

  const link = linkData ? (linkData as unknown as EdgeLinkProps) : null;

  return link
    ? { ...link, key: decodeKeyIfCaseSensitive({ domain, key }) }
    : null;
};
