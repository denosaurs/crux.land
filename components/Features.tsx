function Feature({ title, content }: { title: string; content?: string }) {
  return (
    <div class="w-full bg-secondary rounded-lg shadow-lg p-12 flex flex-col justify-center items-center cursor-pointer transition-[scale] hover:scale-105">
      <div class="text-center">
        <p class="text-xl text-white font-bold mb-1">{title}</p>
        <p class="text-md text-gray-200 mb-2">{content || ""}</p>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 align-center">
        <Feature
          title="IMMUTABLE"
          content="crux.land is a free registry service meant for hosting small scripts."
        />
        <Feature
          title="Open Source"
          content="Made by the Community for the Community."
        />
        <Feature title="Easy To Use!" />
        <div class="col-span-full text-xl text-secondary">
          Crux.land is built with the aim of providing a simple and easy-to-use
          platform for developers to share their scripts with others. The
          platform is designed to be immutable, meaning that once a script is
          uploaded, it cannot be modified or deleted. This ensures that the
          scripts hosted on Crux.land are reliable and trustworthy. The platform
          is also designed to be secure, with all scripts being verified before
          they are uploaded. Crux.land is the perfect platform for developers
          who want to share their scripts with others and contribute to the
          open-source community.
        </div>
      </div>
    </section>
  );
}
